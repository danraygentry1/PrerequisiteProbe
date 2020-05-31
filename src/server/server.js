import appConfig from '../../config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import './initialize-db';
import path from 'path';
import request from 'request';
import { Router } from 'react-router';
import md5 from 'md5';
import { authenticationRoute } from './authenticate';
import {
  connectDB, getPTUser, getPTUserByEmail, getPTUserByHash, getPTUserOrderByPayId
} from './connect-db';
const http = require('http');
const crypto = require('crypto');
const mailgun = require('mailgun-js')({
  apiKey: appConfig.mailgun.apiKey,
  domain: appConfig.mailgun.domain,
});
const helmet = require('helmet');
const paymentService = require('./services/paymentService');
const postgresService = require('./services/postgresService');
const preReqPurchaseRepo = require('../repos/preReqPurchaseRepo');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config');



const app = express();

app.listen(appConfig.port, console.log('Server listening on port', appConfig.port));

app.use(
  cors(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),

); // anything in here is considered a plugin,  BodyParsers use post requests instead of get requests. //anything in here is considered a plugin,  BodyParsers use post requests instead of get requests.
app.use(helmet());
app.use('/vendor', express.static('vendor'))
app.use('/css', express.static('css'))
app.use('/images', express.static('images'))

// WebpackServer.  logging to node console during development
// create a virtual javascript file that watches for changes and hot reloads them
if (process.env.NODE_ENV !== 'production') {
  const webpackCompiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: true,
      'errors-only': true,
    },
  }));
   app.use(webpackHotMiddleware(webpackCompiler, {
     log: console.log,
   }));

  console.log("WEBPACK Middleware")
}


//* **Authentication Section*****************************************************************************************************
authenticationRoute(app);






app.post('/saveUser', (req, res) => {
  postgresService.create_pt_user('pt_user', req.userObj, (err, results) => {
    if (err) {
      res.json(err);
    } else {
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      // res.redirect(url);
      // paypalUrl = url
      console.log('USER SAVED');
      return res.send();
    }
  });
});

app.post('/getuser', async (req, res) => {
  let result
  const pool = await connectDB();
  const userByUserName = await getPTUser(pool, req.body.userObj.user_name);
  const userByEmailAddress = await getPTUserByEmail(pool, req.body.userObj.email_address);
  try {
    if (Object.keys(userByUserName).length !== 0 || Object.keys(userByEmailAddress).length !== 0){
      result = res.send(JSON.stringify({ error: 'The user name and/or email address already exists.  Please choose another user name and/or email address' }));
    }else result = res.send(JSON.stringify({ success: true }));
  }
  catch {
    result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to create the user. Please try again.' }));
  }
  return result
});



// POST to saveresethash
// use result variable so we can use try/catch blocks with async functions.
app.post('/saveresethash', async (req, res) => {
  let result;
  try {
    // check and make sure the email exists
    const pool = await connectDB();
    const foundUser = await getPTUserByEmail(pool, req.body.emailAddress);

    // If the user exists, save their password hash
    if (Object.keys(foundUser).length !== 0) {
      const timeInMs = Date.now();
      const hashString = `${req.body.email}${timeInMs}`;
      const { secret } = appConfig.crypto;
      const passwordResetHash = crypto.createHmac('sha256', secret)
        .update(hashString)
        .digest('hex');

      await postgresService.update_pt_user_password_reset('pt_user', passwordResetHash, foundUser.email_address, (results, err) => {
        if (err) {
          result = res.send(JSON.stringify({ error: err.message }));
        }

        // Put together the email
        const emailData = {
          from: `PrerequisiteProbe <postmaster@${appConfig.mailgun.domain}>`,
          to: foundUser.email_address,
          subject: 'Reset Your Password',
          text: `A password reset has been requested for the PrerequisiteProbe account connected to this email address. If you made this request, please click the following link: ${appConfig.url}/change-password/${passwordResetHash} ... if you didn't make this request, feel free to ignore it!`,
          html: `<p>Hello ${foundUser.first_name}, your user name is:  ${foundUser.user_name}.  A password reset has been requested for the Prerequisite Probe account connected to this email address. If you made this request, please click the following link: <a href="${appConfig.url}/change-password/${passwordResetHash}" target="_blank">${appConfig.url}/change-password/${passwordResetHash}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
        };

        // Send it
        mailgun.messages().send(emailData, (error, body) => {
          if (error || !body) {
            result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to send password reset email. Please try again.' }));
          } else {
            result = res.send(JSON.stringify({ success: true }));
          }
        });
      });
    } else result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to send password reset email. Please try again.' }));
  } catch (err) {
    // if the user doesn't exist, error out
    result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to send password reset email. Please try again.' }));
  }
  return result;
});

// POST to savepassword
app.post('/savepassword', async (req, res) => {
  let result;
  try {
    // look up user in the DB based on password reset hash
    const pool = await connectDB();
    const foundUser = await getPTUserByHash(pool, req.body.passwordResetHash);
    const passwordHash = md5(req.body.password);

    // If the user exists save their new password
    if (Object.keys(foundUser).length !== 0) {
      // eslint-disable-next-line max-len
      await postgresService.update_pt_user_password(passwordHash, req.body.passwordResetHash, (results, err) => {
        if (results) {
          result = res.send(JSON.stringify({ success: 'Password Update Successful' }));
        } else {
          result = res.send(JSON.stringify({ error: err.message }));
        }
      });
    } else result = res.send(JSON.stringify({ error: 'Password Update Failed.  Please re-click the password reset link sent to your email' }));
  } catch (err) {
    // if the hash didn't bring up a user, error out
    result = res.send(JSON.stringify({ error: 'Password Update Failed.  Please re-click the password reset link sent to your email' }));
  }
  return result;
});

//* **End of Authentication Section*****************************************************************************************************

//* **PayPal Section*************************************************************************************************************
app.post('/buysingle', (req, res) => {
  let userObj = req.body;
  let result;
  console.log(`USER OBJECT SENT TO BUY SINGLE SUCCESSFUL${userObj.toString()}`);
  const orderObj = {
    orderID: '',
    orderType: 'PayPal',
    createTime: '',
    transactions: '',
    quantity: 1,
    purchaseName: 'Prerequisite Probe Access',
    purchasePrice: 10.00,
    taxPrice: 0.00,
    shippingPrice: 0.00,
    description: 'Prerequisite Probe Access',
  };
  try {
    // create user first, then buy single order
    postgresService.create_pt_user('pt_user', userObj, (results, err) => {
      // let results1 = results
      // console.log(results1)
      if (err) {
        result = res.send(JSON.stringify({ error: 'Order Failed.  Failed to create user' }))
      }
      else {
        Object.defineProperty(userObj, 'pt_user_id', {
          value: results[0].pt_user_id,
        });
        preReqPurchaseRepo.BuySingle(orderObj,userObj, (err, url) => {

          if (err) {
            console.log("Buy Single Error")
            result = res.send(JSON.stringify({error: err.message}));
          } else {
            console.log("Buy Single Success")
            result = res.send(JSON.stringify({ success: 'Order Created', url }));
            //res.redirect(url)
          }
        });
      }
    });
  }
  catch(err)
  {
    result = res.send(JSON.stringify({ error: 'Order Failed.  Please Try again' }));
  }
  return result;
});

app.get('/cancel/:orderID', (req, res) => {
  const { orderID } = req.params;
  preReqPurchaseRepo.CancelOrder(orderID, (err, results) => {
    if (err) {
      res.send('There was an error removing this order');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/success/:orderID', async (req, res) => {
  const { orderID } = req.params;
  const payerID = req.query.PayerID;
  const payID = req.query.paymentId;
  const pool = await connectDB();
  const userOrder = await getPTUserOrderByPayId(pool, payID);
  const isSubscribed = true

  console.log(`Now in Paypal Buy Success${orderID}`);
  preReqPurchaseRepo.ExecuteOrder(payerID, orderID, payID, (err, successID) => {
    if (err) {
      res.json(err);
    } else {
      console.log('EXECUTE ORDER SUCCESS');
      postgresService.update_pt_user_on_execute_subscribed( userOrder.pt_user_id, isSubscribed, (results, err) => {
        // res.send('Order Placed')
        if (err){
          res.send('Something went wrong with with updating subscribed field in pt_user table');
        }
        res.send(`<h1>Order Placed</h1>Please save your order confirmation number : <h3>${successID}</h3> <a href="${appConfig.url}/login">Click Here to Login </a> `);
      })
    }
  });
});

app.get('/refund/:orderID', (req, res) => {
  const { orderID } = req.params;
  preReqPurchaseRepo.RefundOrder(orderID, (err, refund) => {
    if (err) {
      res.json(err);
    } else {
      res.json(refund);
    }
  });
});

app.get('/orderdetails/:orderID', (req, res) => {
  const { orderID } = req.params;
  preReqPurchaseRepo.GetOrder(orderID, (err, results) => {
    if (err) {
      res.json(err);
    } else {
      res.json(results);
    }
  });
});

//* **PayPal Section*************************************************************************************************************


// tells app which route files defined above to use for which url path.
// any request to the top level of the site, use index
// use "*" to always return to the index page if a defined route is not specified
// in a hard request to the browser (change the url path)
// put all other routs above the app.use('/*', index) route so that express will catch
// any API routes and not send them to the react app

if (process.env.NODE_ENV !== 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('index.html')); // allows us to not use webpack dev server in production.
  });
}

//FIX
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../dist'))); //everthing will be served from this url
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('index.html')); //allows us to not use webpack dev server in production.
  });
}

// Export our app for testing purposes
export const app2 = app;



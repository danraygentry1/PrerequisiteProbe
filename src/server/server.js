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
  connectDB, getPTUser, getPTUserByEmail, getPTUserByHash,
} from './connect-db';

const crypto = require('crypto');
const mailgun = require('mailgun-js')({
  apiKey: appConfig.mailgun.apiKey,
  domain: appConfig.mailgun.domain,
});
const proxy = require('http-proxy-middleware');
const paymentService = require('./services/paymentService');
const postgresService = require('./services/postgresService');
const preReqPurchaseRepo = require('../repos/preReqPurchaseRepo');

// let port = process.env.PORT || 8888;  //process.env.PORT is Heroku port
const port = 9229;
const app = express();

// body parser - allows us to get the data from the body of the request and
// used to parse incoming request bodies
app.use(
  cors(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
); // anything in here is considered a plugin,  BodyParsers use post requests instead of get requests. //anything in here is considered a plugin,  BodyParsers use post requests instead of get requests.

//* **Authentication Section*****************************************************************************************************
authenticationRoute(app);

if (process.env.NODE_ENV == 'production') {
  // serve anything in the /dist folder without putting /dist in front of it
  app.use(express.static(path.resolve(__dirname, '../../dist'))); // everything will be served from this url
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve('index.html')); // allows us to not use webpack dev server in production.
  });
}

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
          text: `A password reset has been requested for the PrerequisiteProbe account connected to this email address. If you made this request, please click the following link: http://localhost:8080/change-password/${passwordResetHash} ... if you didn't make this request, feel free to ignore it!`,
          html: `<p>A password reset has been requested for the Prerequisite Probe account connected to this email address. If you made this request, please click the following link: <a href="http://localhost:8080/change-password/${passwordResetHash}" target="_blank">http://localhost:8080/change-password/${passwordResetHash}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
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
  const userObj = req.body;
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
    // create user first, then buy single order
  postgresService.create_pt_user('pt_user', userObj, (results, err) => {
    // let results1 = results
    // console.log(results1)
    preReqPurchaseRepo.BuySingle(orderObj, (err, url) => {
      if (err) {
        res.json(err);
      } else {
        console.log(`AFTER BUYSINGLE${url}`);
        console.log(`CREATE USER OBJECT SUCCESSFUL${userObj.toString()}`);
        return res.send(url);
      }
    });
  });
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

app.get('/success/:orderID', (req, res) => {
  const { orderID } = req.params;
  const payerID = req.query.PayerID;
  const payID = req.query.paymentId;
  console.log(`Now in Paypal Buy Success${orderID}`);
  preReqPurchaseRepo.ExecuteOrder(payerID, orderID, payID, (err, successID) => {
    if (err) {
      res.json(err);
    } else {
      console.log('EXECUTE ORDER SUCCESS');
      // res.send('Order Placed')
      res.send(`<h1>Order Placed</h1>Please save your order confirmation number : <h3>${successID}</h3>`);
    }
  });
  // res.send('Order Placed')
  // res.redirect('http://localhost:8080/')
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


app.listen(port, console.log('Server listening on port', port));

//* **PayPal Section*************************************************************************************************************


// Export our app for testing purposes
export const app2 = app;

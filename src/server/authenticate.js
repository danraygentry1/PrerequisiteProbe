import uuid from 'uuid';
import crypto from 'crypto';
import express from 'express';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import appConfig from '../../config';
import {
  connectDB, getPTSchoolCourseInfo, getPTSchoolInfo, getPTUser,
} from './connect-db';
import config from '../auth/config';

const mailgun = require('mailgun-js')({
  apiKey: appConfig.mailgun.apiKey,
  domain: appConfig.mailgun.domain,
});


const router = express.Router();
const authenticationTokens = [];

export const authenticationRoute = (app) => {
  app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    // let username = 'Dev'
    // let password = 'TUPLES'
    const pool = await connectDB();

    console.log('UsernameWangs!!!');
    console.log(username);

    console.log('Password!!!');
    console.log(password);

    const user = await getPTUser(pool, username);
    if (!user) {
      return res.status(404).send('User not found'); // 404 = page not found //500 = internal server error
    }


    const hash = md5(password);
    const passwordCorrect = hash === user.password_hash;

    if (!passwordCorrect) {
      return res.status(401).send('Password incorrect'); // 401 = unauthorized
    }

    // console.log("Hash Password")
    // console.log(user["password_hash"])

    /*        let token2 = uuid();
        authenticationTokens.push({
            token2,
            userID:
        }); */
    // if user is found and password is valid
    // create a token
    const userToken = jwt.sign({ id: user.pt_user_id }, config.secret, {
      expiresIn: 3600, // expires in 1 hour
    });

    // unix epoch time is the number of milliseconds since Jan 1 1970
    // Steps to calculate:
    /* 1. authResult.expiresIn contains expiration in seconds
          2. Multiply by 1000 to convert into milliseconds
          3. Add current Unix epoch
          This gives us the Unix epoch time when the token will expire */
    // You can use jwt-decode (on npm) to read the user's data out of the ID Token JWT
    // localStorage.setItem("id_token", token);  //adds to local storage on Application tab in browser


    const state = await getPTSchoolInfo(pool);
    console.log(state);
    state.ptSchoolCourseRowsArray = await getPTSchoolCourseInfo(pool);
    state.userName = username;
    state.firstName = user.first_name

    const userObj = {
      first_name: user.first_name,
      last_name: user.last_name,
      user_name: user.user_name,
      email_address: user.email_address,
      subscribed: user.subscribed,
    };
    state.authentication = {};
    state.authentication.userObj = userObj;
    state.session = { authenticated: 'AUTHENTICATED', id: user.pt_user_id, userToken };
    // res.cookie('auth', userToken)

    // state["userToken"] = userToken
    // state.push(await getPTSchoolCourseInfo(pool)) //+= await getPTSchoolCourseInfo(pool)
    // console.log(state);
    // console.log(state.ptSchoolColumnsArray);
    // console.log(state.ptSchoolRowsArray)
    // res.send({token, state});
    res.send({ state });
  });
}; // async is a handler function

// POST to saveresethash
// use result variable so we can use try/catch blocks with async functions.
/*router.post('/saveresethash', async (req, res) => {
  let result;
  try {
    // check and make sure the email exists
    // const query = User.findOne({ email: req.body.email });
    // const foundUser = await query.exec();
    const pool = await connectDB();
    const foundUser = await getPTUser(pool, req.body.email_address);


    // If the user exists, save their password hash
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const { secret } = appConfig.crypto;
    const hash = crypto.createHmac('sha256', secret)
      .update(hashString)
      .digest('hex');

    result = await postgresService.update_pt_user_password_reset('pt_user', hash, foundUser.email_address);

    /!*  /!* foundUser.save((err) => {
      if (err) { result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' })); }
*!/
      // Put together the email
      const emailData = {
        from: `CloseBrace <postmaster@${appConfig.mailgun.domain}>`,
        to: foundUser.email,
        subject: 'Reset Your Password',
        text: `A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: https://musiclist.com/account/change-password/${foundUser.passwordReset} ... if you didn't make this request, feel free to ignore it!`,
        html: `<p>A password reset has been requested for the Prerequisite Probe account connected to this email address. If you made this request, please click the following link: <a href="https://musiclist.com/account/change-password/${foundUser.passwordReset}&quot; target="_blank">https://musiclist.com/account/change-password/${foundUser.passwordReset}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
      };

      // Send it
      mailgun.messages().send(emailData, (error, body) => {
        if (error || !body) {
          result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to send the email. Please try again.' }));
        } else {
          result = res.send(JSON.stringify({ success: true }));
        }
      });
    }); *!/
  } catch (err) {
    // if the user doesn't exist, error out
    result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' }));
  }
  return result;
});

module.exports = router;*/

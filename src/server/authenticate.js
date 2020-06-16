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

    // console.log(username);

    const user = await getPTUser(pool, username);
    if (!user) {
      return res.status(404).send('User not found'); // 404 = page not found //500 = internal server error
    }

    const hash = md5(password);
    const passwordCorrect = hash === user.password_hash;

    if (!passwordCorrect) {
      return res.status(401).send('Password incorrect'); // 401 = unauthorized
    }

    // create a token
    // unix epoch time is the number of milliseconds since Jan 1 1970
    // Steps to calculate:
    /* 1. authResult.expiresIn contains expiration in seconds
          2. Multiply by 1000 to convert into milliseconds
          3. Add current Unix epoch
          This gives us the Unix epoch time when the token will expire */
    // You can use jwt-decode (on npm) to read the user's data out of the ID Token JWT
    // localStorage.setItem("id_token", token);  //adds to local storage on Application tab in browser
    const userToken = jwt.sign({ id: user.pt_user_id }, config.secret, {
      expiresIn: 3600, // expires in 1 hour
    });


    const state = await getPTSchoolInfo(pool);
    // console.log(state);
    state.ptSchoolCourseRowsArray = await getPTSchoolCourseInfo(pool);
    state.userName = username;
    state.firstName = user.first_name;

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

    res.send({ state });
  });
}; // async is a handler function

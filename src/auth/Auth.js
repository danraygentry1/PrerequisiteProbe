const jwt = require('jsonwebtoken');
const config = require('./config.js');

import Cookies from "js-cookie";


export function isTokenVerified(userToken) {
 let isTokenVerified = false
  jwt.verify(userToken, config.secret, function(err, decoded) {
    if (err){
      isTokenVerified = false
      console.log("verifyToken Called False" + userToken)
    }
    else {
      isTokenVerified = true
      console.log("verifyToken Called True" + userToken)
    }
  });

 return isTokenVerified

};
export function logout() {
  Cookies.remove('auth')
}
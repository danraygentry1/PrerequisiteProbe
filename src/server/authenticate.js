import uuid from 'uuid';
import md5 from 'md5';
import {connectDB, getPTSchoolCourseInfo, getPTSchoolInfo, getPTUser} from './connect-db';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs'
import config from '../auth/config'
const authenticationTokens = [];

export const authenticationRoute = app => {

    app.post('/authenticate', async (req,res)=>{
        let {username, password} = req.body;
        //let username = 'Dev'
        //let password = 'TUPLES'
        const pool = await connectDB();

        console.log("Username!!!")
        console.log(username)

        console.log("Password!!!")
        console.log(password)

        let user = await getPTUser(pool, username)
        if (!user) {
            return res.status(404).send("User not found") //404 = page not found //500 = internal server error
        }


        let hash = md5(password);
        let passwordCorrect = hash === user["password_hash"];

        if (!passwordCorrect) {
            return res.status(401).send("Password incorrect"); //401 = unauthorized
        }

        //console.log("Hash Password")
        //console.log(user["password_hash"])

/*        let token2 = uuid();
        authenticationTokens.push({
            token2,
            userID:
        });*/
        // if user is found and password is valid
        // create a token
        let userToken = jwt.sign({ id: user["pt_user_id"]}, config.secret, {
            expiresIn: 3600 // expires in 1 hour
        });

        //unix epoch time is the number of milliseconds since Jan 1 1970
        //Steps to calculate:
        /*1. authResult.expiresIn contains expiration in seconds
          2. Multiply by 1000 to convert into milliseconds
          3. Add current Unix epoch
          This gives us the Unix epoch time when the token will expire*/
        //You can use jwt-decode (on npm) to read the user's data out of the ID Token JWT
        //localStorage.setItem("id_token", token);  //adds to local storage on Application tab in browser


        let state = await getPTSchoolInfo(pool)
        console.log(state)
        state["ptSchoolCourseRowsArray"] = await getPTSchoolCourseInfo(pool);
        state["userName"] = username;
        state["session"] = {authenticated:'AUTHENTICATED', id:user["pt_user_id"], userToken:userToken}
        //res.cookie('auth', userToken)

       // state["userToken"] = userToken
        //state.push(await getPTSchoolCourseInfo(pool)) //+= await getPTSchoolCourseInfo(pool)
        //console.log(state);
        //console.log(state.ptSchoolColumnsArray);
        //console.log(state.ptSchoolRowsArray)
        //res.send({token, state});
        res.send({state});
    })
} //async is a handler function
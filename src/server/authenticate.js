import uuid from 'uuid';
import md5 from 'md5';
import {connectDB, getPTSchoolCourseInfo, getPTSchoolInfo, getPTUser} from './connect-db';
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
            return res.status(500).send("User not found") //500 = internal server error
        }

        //console.log("User Row Single!!!")
       // console.log(user)

        let hash = md5(password);
        let passwordCorrect = hash === user["password_hash"];

        if (!passwordCorrect) {
            return res.status(500).send("Password incorrect");
        }

        //console.log("Hash Password")
        //console.log(user["password_hash"])

        let token = uuid();
        authenticationTokens.push({
            token,
            userID: user["pt_user_id"]
        });
        let state = await getPTSchoolInfo(pool)
        console.log(state)
        state["ptSchoolCourseRowsArray"] = await getPTSchoolCourseInfo(pool);
        state["userName"] = username;
        //state.push(await getPTSchoolCourseInfo(pool)) //+= await getPTSchoolCourseInfo(pool)
        //console.log(state);
        //console.log(state.ptSchoolColumnsArray);
        //console.log(state.ptSchoolRowsArray)
        //res.send({token, state});
        res.send({state});
    })
} //async is a handler function
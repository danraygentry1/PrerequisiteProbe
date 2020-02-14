import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connectDB } from './connect-db'
import './initialize-db'
import { authenticationRoute } from './authenticate'
import path from 'path';
import request from 'request'
import {Router} from "react-router";
let paymentService = require('../server/services/paymentService')
let preReqPurchaseRepo = require('../repos/preReqPurchaseRepo')
let proxy = require('http-proxy-middleware');

//let port = process.env.PORT || 8888;  //process.env.PORT is Heroku port
let port = 9229
let app = express();
//let router = app.router


/*let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}*/

/*app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});*/


/*let whitelist = ['http://localhost:8080', 'http://localhost:9229', 'https://urgyensamtenling.org/'];
let corsOptions = {
    origin: function(origin, callback){
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};*/


/*app.use(function(req, res, next) {
    cors(corsOptions),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json(),
    //res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/




/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next
});*/



/*
app.all('*', function(req, res,next) {
    /!**
     * Response settings
     * @type {Object}
     *!/
    let responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /!**
     * Headers
     *!/
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});
*/





//app.get('/', (req,res)=>{
    //res.send(" Hello World!");
//})//req = request, res = response

/*
const enableCORS = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,REDIRECT,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With,Accept, *');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
app.all("/!*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,REDIRECT,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, Accept, *');
    next();
});
app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});
app.post('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});
app.use(enableCORS);
//cors({ origin: true})*/

app.use(
    '/server/server',
    proxy({ target: 'http://localhost:3000', changeOrigin: true })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json(),
    //next()

) //anything in here is considered a plugin,  BodyParsers use post requests instead of get requests.

app.listen(port, console.log("Server listening on port", port));



/*router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/





authenticationRoute(app);





if (process.env.NODE_ENV == `production`) {
    app.use(express.static(path.resolve(__dirname, '../../dist'))); //everything will be served from this url
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('index.html')); //allows us to not use webpack dev server in production.
    });
}



export const addNewTask = async task=>{
    let db = await connectDB();
    let collection = db.collection('tasks');
    await collection.insertOne(task);
}

export const updateTask = async task=>{
    let { id, group, isComplete, name } = task;
    let db = await connectDB()
    let collection = db.collection('tasks');

    if (group) {
        await collection.updateOne({id}, {$set:{group}})
    };
    if (name) {
        await collection.updateOne({id}, {$set:{name}})
    };
    if (isComplete) {
        await collection.updateOne({id}, {$set:{isComplete}})
    };
}


/*app.post('/task/new', async (req,res)=>{
    let task = req.body.task;
    await addNewTask(task);
    res.status(200).send()

});  //task/new is a root on the server

app.post('/task/update', async (req,res)=>{
    let task = req.body.task;
    await updateTask(task);
    res.status(200).send()
}); *///task/update is a root on the server
// async is a middleware function executed for post requests (handles post request to task/update mount path)

//--------------------------------------------------------
//Single Purchases

/*app.post('/jokes/random', (req, res) => {
    request(
        { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err.message });
            }

            res.json(JSON.parse(body));
        }
    )
});*/

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});*/

/*app.post('/buysingle', async (req, res)=>{
//res.header("Access-Control-Allow-Origin", "*");
//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//res.set("Access-Control-Allow-Origin", '*');
//res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// let orderObj = req.body.orderObj;
const orderObj = {
    orderID: "",
    orderType: "PayPal",
    createTime: "",
    transactions: "",
    quantity: 1,
    purchaseName: "Prerequisite Probe Access",
    purchasePrice: 10.00,
    taxPrice: 0.00,
    shippingPrice: 0.00,
    description: "Prerequisite Probe Access"
};
preReqPurchaseRepo.BuySingle(orderObj, (err, url)=>{
    /!*res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");*!/
        if(err){
            res.json(err);
        } else {
            request(
                { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
                (error, response, body) => {
                    res.redirect(url);
                }
            )
            //axios.post(url);
        }
    });
});*/

app.post('/buysingle', (req, res)=>{
//res.header("Access-Control-Allow-Origin", "*");
//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//res.set("Access-Control-Allow-Origin", '*');
//res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// let orderObj = req.body.orderObj;
const orderObj = {
    orderID: "",
    orderType: "PayPal",
    createTime: "",
    transactions: "",
    quantity: 1,
    purchaseName: "Prerequisite Probe Access",
    purchasePrice: 10.00,
    taxPrice: 0.00,
    shippingPrice: 0.00,
    description: "Prerequisite Probe Access"
};
preReqPurchaseRepo.BuySingle(orderObj, (err, url)=>{
  /* res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Access-Control-Allow-Origin", '*');
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");*/
        if(err){
            res.json(err);
        } else {
            console.log("BEFORE REDIRECT")
            res.redirect(url);
            console.log("AFTER REDIRECT")
            //axios.post(url);
        }
    });
});



app.get('/cancel/:orderID', (req, res)=>{
    let orderID = req.params.orderID;
    preReqPurchaseRepo.CancelOrder(orderID, (err, results)=>{
        if(err){
            res.send("There was an error removing this order");
        } else {
            res.redirect("/");
        }
    });
});

app.get('/success/:orderID', (req, res)=>{
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let orderID = req.params.orderID;
    //res.send(orderID);
    let payerID = req.query.PayerID;
    let payID = req.query.paymentId
    preReqPurchaseRepo.ExecuteOrder(payerID, orderID, payID, (err, successID)=>{
        if(err){
            res.json(err);
        } else {

            res.send('Order Placed')
            //res.send('<h1>Order Placed</h1>Please save your order confirmation number : <h3>' + successID + '</h3>');
        }
    });
}) ;

app.get('/refund/:orderID', (req, res)=>{
    let orderID = req.params.orderID;
    preReqPurchaseRepo.RefundOrder(orderID, (err, refund)=>{
        if(err){
            res.json(err);
        } else {
            res.json(refund);
        }
    });
});

app.get('/orderdetails/:orderID', (req, res)=>{
    let orderID = req.params.orderID;
    preReqPurchaseRepo.GetOrder(orderID, (err, results)=>{
        if(err){
            res.json(err);
        } else {
            res.json(results);
        }
    });
});

//--------------------------------------------------------



// Export our app for testing purposes
export const app2 = app;
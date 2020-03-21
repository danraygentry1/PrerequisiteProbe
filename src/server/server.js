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
let postgresService = require('../server/services/postgresService')
let preReqPurchaseRepo = require('../repos/preReqPurchaseRepo')
let proxy = require('http-proxy-middleware');

//let port = process.env.PORT || 8888;  //process.env.PORT is Heroku port
let port = 9229
let app = express();

//body parser - aows us to get the data from the body of the requests
app.use(
    cors(),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
) //anything in here is considered a plugin,  BodyParsers use post requests instead of get requests. //anything in here is considered a plugin,  BodyParsers use post requests instead of get requests.



authenticationRoute(app);

if (process.env.NODE_ENV == `production`) {
    app.use(express.static(path.resolve(__dirname, '../../dist'))); //everything will be served from this url
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('index.html')); //allows us to not use webpack dev server in production.
    });
}


app.post('/saveUser', (req, res)=> {
    postgresService.create_pt_user("pt_user", req.userObj, (err, results)=>{
        if(err){
            res.json(err);
        } else {
            //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            //res.redirect(url);
            //paypalUrl = url
            console.log("USER SAVED")
            return res.send()
        }
    })
})



app.post('/buysingle', (req, res)=>{
    let userObj = req.body
    console.log("USER OBJECT SENT TO BUY SINGLE SUCCESSFUL" + userObj.toString())
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
    //create user first, then buy single order
    postgresService.create_pt_user("pt_user", userObj, (results, err)=> {
        //let results1 = results
        //console.log(results1)
        preReqPurchaseRepo.BuySingle(orderObj, (err, url) => {
            if (err) {
                res.json(err);
            } else {
                console.log("AFTER BUYSINGLE" + url)
                console.log("CREATE USER OBJECT SUCCESSFUL" + userObj.toString())
                return res.send(url)
            }
        });
    })
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

    let orderID = req.params.orderID;
    let payerID = req.query.PayerID;
    let payID = req.query.paymentId
    console.log("Now in Paypal Buy Success" + orderID)
    preReqPurchaseRepo.ExecuteOrder(payerID, orderID, payID, (err, successID)=>{
        if(err){
            res.json(err);
        } else {
            console.log("EXECUTE ORDER SUCCESS")
            //res.send('Order Placed')
            res.send('<h1>Order Placed</h1>Please save your order confirmation number : <h3>' + successID + '</h3>');
        }
    });
    //res.send('Order Placed')
    //res.redirect('http://localhost:8080/')
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

app.listen(port, console.log("Server listening on port", port));



//--------------------------------------------------------



// Export our app for testing purposes
export const app2 = app;
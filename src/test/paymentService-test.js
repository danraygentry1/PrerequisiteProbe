import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { app2 } from "../server/server";
import {describe} from "mocha";
//import postgresService from '../server/services/postgresService'
let paymentService = require('../server/services/paymentService')
let should = chai.should()
let expect = chai.expect
chai.use(chaiHttp);

chai.should();

describe("PayPal Order", function () {
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
    let url = ''
    beforeEach(function() {

        let itemObj = {
            name: orderObj.purchaseName,
            price: orderObj.purchasePrice,
            currency: "USD",
            quantity: 1
        };
        let itemArray = [];
        itemArray.push(itemObj);


        let transactionItemObj = {
            "amount": {
                "total": 10,
                "currency": "USD",
                "details": {
                    "tax": orderObj.taxPrice,
                    "shipping": orderObj.shippingPrice
                }
            },
            "description": orderObj.description,
            "item_list": {"items": itemArray}
        }

        let transactionArray = [];
        transactionArray.push(transactionItemObj);

    });
    it("Should create a single order", (done) => {
        chai.request(app2)
            .post('/buysingle')
            .send({
                'orderObj': orderObj,
            })
            .end((err, res) => {
                // res.should.have.status(200);
                url = res.request.url
                url.should.be.a('string')
                done();
            })
    });

/*    it("Should execute a single order", (done) => {
        chai.request(app2)
            .post('/success/:orderID')
            .send({
                'orderObj': orderObj,
            })
            .end((err, res) => {
                // res.should.have.status(200);
                url = res.body
                res.body.should.be.a('string');
                done();
            })
    });*/
       /* it("Should redirect to PayPal approval page", (done) => {
        chai.request(app2)
            .post(url)
            .end((err, res) => {
                // res.should.have.status(200);
                url = res.body
                res.body.should.be.a('object');
                done();
            })
         });

    it("Create PayPal payment and update pt_user_order table", function () {
        paymentService.CreateWithPaypal(transactionArray, orderObj, "http://localhost:8080/success", "http://localhost:8080/cancel", (err, results)=>{
            sinon.assert.isNotNull(results)*/
           /* if(sinon.assert.isNotNull(results))
            {
                res.redirect(url);
                it("should get approval", (done) => {
                    chai.request(app2)
                        .post('/authenticate')
                        .send({
                            'username': 'Dev',
                            'password': 'TUPLES',
                        })
                        .end((err, res) => {
                            // res.should.have.status(200);
                            res.body.should.be.a('object');
                            done();
                        })
                });
            }
        })
    })*/
})

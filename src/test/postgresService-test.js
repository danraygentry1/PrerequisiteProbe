import chai from 'chai';
import sinon from 'sinon';
import md5 from "md5";
import {describe} from "mocha";
//import postgresService from '../server/services/postgresService'

let postgresService = require('../server/services/postgresService')
let should = chai.should()
let expect = chai.expect

chai.should();

describe("PayPal Order", function () {
    let payID = 'PAYID-LYSL2JA4U743880AL1038501'

    let orderObj = {
        orderID: "",
        orderType: "paypal",
        createTime: "",
        transactions: "",
        quantity: 1,
        purchaseName: "Prerequisite Probe Access",
        purchasePrice: 10.00,
        taxPrice: 0.00,
        shippingPrice: 0.00,
        description: "Prerequisite Probe Access"
    };

    let userObj = {
        first_name: "Danny",
        last_name: "Pinturo",
        user_name: "danny",
        password_hash: md5("jeffery"),
        email_address: "danny@gmail.com",
        subscribed: "false"
    }

    beforeEach(function() {

    });
    it("Should Insert a new user into the database", function (done) {
        postgresService.create_pt_user('pt_user', userObj, (results) => {
            should.exist(results)
            done()
        })
    });

    it("Should Insert a PayPal order into the database", function (done) {
        postgresService.create_pt_user_order_on_buy('pt_user_order', orderObj, (results) => {
            should.exist(results)
            done()
        })
    });
    it("Should Read a PayPal order from the database", function (done) {
        postgresService.get_pt_user_order('pt_user_order', payID, (results) => {
            should.exist(results)
            done()
        })
    });
    it("Should Update PayPal order", (done) => {
        let payID = 'PAYID-LYRDWQA8LY71751KC739363Y'
        let orderID = 'ORxb1'
        let payerID = 'PYxb1'
        postgresService.update_pt_user_order_on_execute('pt_user_order', payerID, orderID, payID, (results) => {
            should.exist(results)
            done()
        })
    });

})

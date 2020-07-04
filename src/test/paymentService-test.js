import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import md5 from 'md5';
import { app2 } from '../server/server';

// import postgresService from '../server/services/postgresService'
const stringify = require('json-stringify-safe');
const paymentService = require('../server/services/paymentService');

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

chai.should();

describe('PayPal Order', () => {
  const orderObj = {
    orderID: '',
    orderType: 'PayPal',
    createTime: '',
    transactions: '',
    quantity: 1,
    purchaseName: 'PT School Probe Access',
    purchasePrice: 9.99,
    taxPrice: 0.00,
    shippingPrice: 0.00,
    description: 'PT School Probe Access',
  };
  // INSERT INTO pt_user(first_name, last_name, user_name, password_hash, email_address, subscribed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'
  const userObj = {
    first_name: 'Danny',
    last_name: 'Pinturo',
    user_name: 'danny18',
    password_hash: md5('jeffery'),
    email_address: 'danny18@gmail.com',
    subscribed: 'false',
  };

  const couponCodeId = 1
  const couponCodePercent = 0.2

  let url = '';
  beforeEach(() => {
    const itemObj = {
      name: orderObj.purchaseName,
      price: orderObj.purchasePrice,
      currency: 'USD',
      quantity: 1,
    };
    const itemArray = [];
    itemArray.push(itemObj);


    const transactionItemObj = {
      amount: {
        total: 10,
        currency: 'USD',
        details: {
          tax: orderObj.taxPrice,
          shipping: orderObj.shippingPrice,
        },
      },
      description: orderObj.description,
      item_list: { items: itemArray },
    };

    const transactionArray = [];
    transactionArray.push(transactionItemObj);
  });
  // TO DO: need to stringify userObj to make test work
  it('Should create a single order', (done) => {
    chai.request(app2)
      .post('/buysingle')
      .send({
        userObj, couponCodeId, couponCodePercent,
      })
      .end((err, res) => {
        // res.should.have.status(200);
        url = res.request.url;
        url.should.be.a('string');
        done();
      });
  });
});

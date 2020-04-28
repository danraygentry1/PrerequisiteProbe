import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { app2 } from '../server/server';
// import postgresService from '../server/services/postgresService'
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
    purchaseName: 'Prerequisite Probe Access',
    purchasePrice: 10.00,
    taxPrice: 0.00,
    shippingPrice: 0.00,
    description: 'Prerequisite Probe Access',
  };
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
  it('Should create a single order', (done) => {
    chai.request(app2)
      .post('/buysingle')
      .send({
        orderObj,
      })
      .end((err, res) => {
        // res.should.have.status(200);
        url = res.request.url;
        url.should.be.a('string');
        done();
      });
  });
});

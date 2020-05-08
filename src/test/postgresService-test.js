import chai from 'chai';
import sinon from 'sinon';
import md5 from 'md5';
import { describe } from 'mocha';
// import postgresService from '../server/services/postgresService'

const postgresService = require('../server/services/postgresService');

const should = chai.should();
const { expect } = chai;

chai.should();

describe('PayPal Order', () => {
  const payID = 'PAYID-LYSL2JA4U743880AL1038501';

  const orderObj = {
    orderID: '',
    orderType: 'paypal',
    createTime: '',
    transactions: '',
    quantity: 1,
    purchaseName: 'Prerequisite Probe Access',
    purchasePrice: 10.00,
    taxPrice: 0.00,
    shippingPrice: 0.00,
    description: 'Prerequisite Probe Access',
  };

  const userObj = {
    first_name: 'Danny',
    last_name: 'Pinturo',
    user_name: 'danny',
    password_hash: md5('jeffery'),
    email_address: 'danny@gmail.com',
    subscribed: 'false',
  };

  beforeEach(() => {

  });
  it('Should Insert a new user into the database', (done) => {
    postgresService.create_pt_user('pt_user', userObj, (results) => {
      should.exist(results);
      done();
    });
  });

  it('Should Insert a PayPal order into the database', (done) => {
    postgresService.create_pt_user_order_on_buy('pt_user_order', orderObj, (results) => {
      should.exist(results);
      done();
    });
  });
  it('Should Read a PayPal order from the database', (done) => {
    postgresService.get_pt_user_order('pt_user_order', payID, (results) => {
      should.exist(results);
      done();
    });
  });
  it('Should Update PayPal order', (done) => {
    const payID = 'PAYID-LYRDWQA8LY71751KC739363Y';
    const orderID = 'ORxb1';
    const payerID = 'PYxb1';
    postgresService.update_pt_user_order_on_execute('pt_user_order', payerID, orderID, payID, (results) => {
      should.exist(results);
      done();
    });
  });
});

describe('PT User Transactions', () => {
  it('Should Update pt_user subscribed field', (done) => {
    const ptUserId = '56';
    const isSubscribed = true
    postgresService.update_pt_user_on_execute_subscribed(ptUserId, isSubscribed, (results, err) => {
      should.exist(results);
      done();
    });
  });


  it('Should Update pt_user table with password_reset hash', (done) => {
    const passwordReset = 'ORxb144gsafg555444';
    const emailAddress = 'prerequisiteprobetest@gmail.com';
    postgresService.update_pt_user_password_reset('pt_user_order', passwordReset, emailAddress, (results) => {
      should.exist(results);
      done();
    });
  });

  it('Should Update pt_user table with newly reset password', (done) => {
    const passwordHash = 'ddsseeefff';
    const passwordReset = '7a9fdffff8e9a540b4e3a242d923abc4b227c3dc399db31f0d33bdc15ba7d65s1';
    postgresService.update_pt_user_password(passwordHash, passwordReset, (results) => {
      should.exist(results);
      done();
    });
  });
});

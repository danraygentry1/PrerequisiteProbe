import chai from 'chai';
import sinon from 'sinon';
import md5 from 'md5';
import { describe } from 'mocha';
import {
  connectDB, getPTSchoolCourseInfo, getPTSchoolInfo, getPTUser, getPTUserByHash, getPTUserOrderByPayId, getPTCouponCode,
} from '../server/connect-db';
// import postgresService from '../server/services/postgresService'

const postgresService = require('../server/services/postgresService');

const should = chai.should();
const { expect } = chai;

chai.should();

describe('Database Transactions', () => {
  beforeEach(() => {

  });
  it('Should get PT user from database', async () => {
    const pool = await connectDB();
    const username = 'danny';
    const user = await getPTUser(pool, username);
    should.exist(user);
  });
//horse shit
  it('Should get PT user from database based on password reset hash', async () => {
    const pool = await connectDB();
    const passwordResetHash = 'seeefffsss'
    const user = await getPTUserByHash(pool, passwordResetHash);
    should.exist(user);
  });
  it('Should get PT user order from database based on payId', async () => {
    const pool = await connectDB();
    const payId = 'PAYID-L222P6Y48480965U3241125N'
    const userOrder = await getPTUserOrderByPayId(pool, payId);
    should.exist(userOrder);
  });
  it('Should get PT Coupon Code ID from database based on coupon code', async () => {
    const pool = await connectDB();
    const couponCode = 'preptgrind'
    const couponCodeRow = await getPTCouponCode(pool, couponCode);
    should.exist(couponCodeRow);
  });

});

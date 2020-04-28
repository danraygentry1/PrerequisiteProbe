import chai from 'chai';
import sinon from 'sinon';
import md5 from 'md5';
import { describe } from 'mocha';
import {
  connectDB, getPTSchoolCourseInfo, getPTSchoolInfo, getPTUser, getPTUserByHash,
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
    const username = 'danraygentry';
    const user = await getPTUser(pool, username);
    should.exist(user);
  });

  it('Should get PT user from database based on password reset hash', async () => {
    const pool = await connectDB();
    const parameterName = 'password_reset'
    const parameterValue = 'danny';
    const user = await getPTUserByHash(pool, parameterName, parameterValue);
    should.exist(user);
  });

});

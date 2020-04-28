import chai from 'chai';
import sinon from 'sinon';
import md5 from 'md5';
import { describe } from 'mocha';
import { createHash } from '../../app/store/actions/authenticate';

const should = chai.should();
const { expect } = chai;

chai.should();

describe('Authentication Actions', () => {
  beforeEach(() => {

  });
  it('Should Update PT_User table with password_reset hash', async () => {
    const emailAddress = 'prerequisiteprobetest@gmail.com';
    const temp = await createHash(emailAddress)
    should.exist(emailAddress);
  });

});

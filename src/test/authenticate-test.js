// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app2 } from '../server/server';
import md5 from "md5";
// Configure chai
chai.use(chaiHttp);
chai.should();
describe('Login tests', () => {
  describe('POST /', () => {
    // Test to get all students record
    it('should get authentication state', (done) => {
      chai.request(app2)
        .post('/authenticate')
        .send({
          username: 'Dev',
          password: 'TUPLES',
        })
        .end((err, res) => {
          // res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});

describe('Password Tests', () => {
  describe('POST /', () => {
    // Test to get all students record
    it('should save password reset hash based on email address', (done) => {
      chai.request(app2)
        .post('/saveresethash')
        .send({
          emailAddress: 'prerequisiteprobetest@gmail.coms',
        })
        .end((err, res) => {
          // res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('should save password based on password reset hash', (done) => {
      chai.request(app2)
        .post('/savepassword')
        .send({
          passwordResetHash: 'fcc1c12d27a5a61920c8304190d63ae7ea88989d5b48a24df39007eb7f83f172',
          password: '3ddwenisabc',
        })
        .end((err, res) => {
          // res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
describe('User Account Tests', () => {
  describe('POST /', () => {
    // Test to get all students record
    it('should get user object if exists', (done) => {
      const userObj = {
        first_name: 'Danny',
        last_name: 'Pinturo',
        user_name: 'danny',
        password_hash: md5('jeffery'),
        email_address: 'danny@gmail.com',
        subscribed: 'false',
      };
      chai.request(app2)
        .post('/getuser')
        .send({
          userObj,
        })
        .end((err, res) => {
          // res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});

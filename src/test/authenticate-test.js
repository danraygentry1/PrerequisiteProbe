// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app2 } from '../server/server';
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
    it('should save password reset hash based on email Address', (done) => {
      chai.request(app2)
        .post('/saveresethash')
        .send({
          emailAddress: 'prerequisiteprobetest@gmail.com',
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
          passwordResetHash: '1a3e96c5af23620951dbc6498f28bdd494e4c3e655e4a2f4cf4839bb8c77ceb6',
          password: '3ddwenisa',
        })
        .end((err, res) => {
          // res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});

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
    it('should get', (done) => {
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
  });
});

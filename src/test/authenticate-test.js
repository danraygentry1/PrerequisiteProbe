import { app2 } from '../server/server';
// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Students", () => {
    describe("POST /", () => {
        // Test to get all students record
        it("should get authentication state", (done) => {
            chai.request(app2)
                .post('/authenticate')
                .send({
                    'username': 'Dev',
                    'password': 'TUPLES',
                })
                .end((err, res) => {
                   // res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        });
    });
});
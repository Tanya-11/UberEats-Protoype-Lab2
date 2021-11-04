let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
chai.should();
chai.use(chaiHttp);

describe('POST /fav-add', () => {
    it('It should get favorites', (done) => {
        chai.request(server)
            .post('/api/fav-add')
            .send({ user: "user@gmail.com", restaurant: "paradise@gmail.com", isFav: false })
            .end((err, response) => {
                response.should.have.status(200);
                done();

            })
    });
    it('It should not get favorites', (done) => {
        chai.request(server)
            .post('/api/favs')
            .send({ user: "user@gmail.com", restaurant: "", isFav: false })
            .end((err, response) => {
                response.should.have.status(400);
                done();

            })
    });
});
describe('POST customer/profile', () => {
    it('It should get customer profile', (done) => {
        chai.request(server)
            .post('/api/customer/profile')
            .send({ "username": "user@gmail.com" })
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                done();
            })
    });
    it('It should not get customer profile', (done) => {
        chai.request(server)
            .post('/api/customer/profile')
            .send({ "username": "" })
            .end((err, response) => {
                response.should.have.status(500);
                done();
            })
    });
});

describe('POST /cancelled-orders', () => {
    it('It should get cancelled orders', (done) => {
        chai.request(server)
            .post('/api/cancelled-orders')
            .send({ user: "user@gmail.com" })
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                done();
            })
    });
    it('It should not get cancelled orders', (done) => {
        chai.request(server)
            .post('/api/cancelled-orders')
            .send({ user: "" })
            .end((err, response) => {
                response.should.have.status(400);
                done();
            })
    });
});
describe('POST /past-orders', () => {
    it('It should get past orders', (done) => {
        chai.request(server)
            .post('/api/past-orders')
            .send({ user: "user@gmail.com" })
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                done();
            })
    });
    it('It should not get past orders', (done) => {
        chai.request(server)
            .post('/api/past-orders')
            .send({ user: "" })
            .end((err, response) => {
                response.should.have.status(400);
                done();
            })
    });
});
describe('POST /active-orders', () => {
    it('It should get active orders', (done) => {
        chai.request(server)
            .post('/api/active-orders')
            .send({ user: "user@gmail.com" })
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                done();
            })
    });
    it('It should not get active orders', (done) => {
        chai.request(server)
            .post('/api/active-orders')
            .send({ user: "" })
            .end((err, response) => {
                response.should.have.status(400);
                done();
            })
    });
});
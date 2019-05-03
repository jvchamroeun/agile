process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost:27017/accounts';
const TEST_URI = 'mongodb://localhost:27017/test';


function connect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(DB_URI,
                        { useNewUrlParser: true, useCreateIndex: true })
                        .then((res, err) => {
                            if (err) return reject(err);
                            resolve();
                        })
                })
        } else {
            mongoose.connect(DB_URI,
                { useNewUrlParser: true, useCreateIndex: true })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
        }
    });
}

function close(){
    return mongoose.disconnect();
}

var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../project');
const utils = require('../utils');

describe('GET /', function () {
    it("should return webpage with title of 'Welcome to the login page.' GET /", function (done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done()
            })
    });

    it("should return webpage with title of 'Welcome to the login page.' GET /login", function (done) {
        chai.request(app)
            .get('/login')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done()
            })
    });
});


describe('POST /', function () {
    before((done) => {
        connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        close()
            .then(() => done())
            .catch((err) => done(err));
    });

    it('creating new user in MongoDB',(done) => {
        chai.request(app).post('/register')
            .send({firstname:'Super', lastname:'Saiyan', username:'SuperSaiyan', password:'apple123456', confirm_password:'apple123456'})
            .then((res) => {
                    expect(res).to.have.status(200);
                    done();
            })
            .catch((err) => done(err));
    });

    it('find new user created in MongoDB', (done) => {
        var _db = utils.getDb();
        _db.collection('user_accounts').findOne({username:'SuperSaiyan'}, function(err, result) {
            if(err){
                console.log(err);
                done(err);
            } else {
                expect(result.username).to.equal('SuperSaiyan');
                done()
            }
        });
    });

    it('should result in password being hashed', (done) => {
        var _db = utils.getDb();
        _db.collection('user_accounts').findOne({username:'SuperSaiyan'}, function(err, result) {
            if(err){
                console.log(err);
                done(err);
            } else {
                console.log(result.password);
                expect(result.password).to.not.equal('apple123456');
                done()
            }
        });
    });

    it("should return webpage with title of 'Welcome to the login page.' GET /login-fail ", (done) => {
        chai.request(app).post('/login')
            .send({username:'NotExist', password:"randompassword"})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch((err) => done(err));
    });

    // it("should return webpage with title of 'Welcome to the trading page.' GET /trading-success ", (done) => {
    //     chai.request(app).post('/login')
    //         // .send({username:'SuperSaiyan', password:"apple123456"})
    //         .field('username', 'SuperSaiyan')
    //         .field('password', 'apple123456')
    //         .then((res) => {
    //             expect(res).to.have.status(200);
    //             done();
    //         })
    //         .catch((err) => done(err));
    // });



});
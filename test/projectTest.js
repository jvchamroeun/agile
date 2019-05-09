process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost:27017/accounts';
const TEST_URI = 'mongodb://localhost:27017/test';
const passport = require('passport');
var express = require('express');

var cheerio = require("cheerio");
const nock = require("nock");
var moment = require("moment");



var accountSchema=({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    type: String,
    cash2: Array,
    stocks: Array
});

var account;

function connect() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(DB_URI,
                        { useNewUrlParser: true, useCreateIndex: true })
                        .then((db) => {
                            account = db.model('test', accountSchema)
                        })
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


var agent = chai.request.agent(app);
describe("GET /trading-success", function () {

    it("Successful log in", function (done) {
        agent
            .post("/login")
            .send({
                _method: "post",
                username: "MaxiMaxr",
                password: "apple12345"
            })
            .then(function (res) {
                var exp = "/trading-success";
                expect(res.req.path).to.equal(exp);
                expect(res).to.have.status(200);
                done();
            });
    });
});

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

describe('POST /register', function () {
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

    it('creating another user in MongoDB',(done) => {
        chai.request(app).post('/register')
            .send({firstname:'Maxi', lastname:'Maxer', username:'MaxiMaxr', password:'apple12345', confirm_password:'apple12345'})
            .then((res) => {
                expect(res).to.have.status(200);
                done();
            })
            .catch((err) => done(err));
    });


    it("should create a test user in Mock-Database", function(done) {
        account.create({
            firstname: "Test",
            lastname: "Tester",
            username: "Testing",
            password: "TestMePlease",
            type: "standard",
            cash2: [],
            stocks: []
        }, function(err) {
            expect(err).not.to.be.ok;
            done(err);
        });
    });

    it("should find test user in Mock-Database", function(done) {
        account.findOne({username: "Testing"}, function(err, result) {
            expect(err).not.to.be.ok;
            done(err);
        });
    });
});

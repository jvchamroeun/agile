const MongoClient = require('mongodb').MongoClient;
const db_uri = "mongodb+srv://jasonadmin:jasoniscool@accounts-ij7tq.mongodb.net/accounts";

var _db = null;

module.exports.getDb = function() {
    return _db;
};

module.exports.init = function(callback) {
    // MongoClient.connect('mongodb://localhost:27017/test', function(err, client) {
    MongoClient.connect(db_uri, function(err, client) {
        if (err) {
            return console.log('Unable to connect to DB');
        }
        _db = client.db('accounts');
        console.log('Successfully connected to MongoDB server');
    })
};

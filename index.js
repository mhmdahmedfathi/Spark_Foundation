var express = require('express');
var http = require('http');
const path = require('path');
const app = express();
const mongo = require('mongodb');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8080;
const url = process.env.URL || "mongodb://localhost:27017";

app.get('/', (req, res, next) => {
    const MongoClient = mongo.MongoClient;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {

        if (err) throw err;
        const db = client.db("SparkFoundation");
        db.collection('Transfers').find({}).toArray().then((Transfers) => {
            res.render(path.join(__dirname, 'public', 'Transfer.ejs'), { Transfers: Transfers });
        }).catch((err) => {
            console.log(err);
        });

    });
});
app.post('/Add', (req, res, next) => {
    const MongoClient = mongo.MongoClient;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {

        if (err) throw err;
        const db = client.db("SparkFoundation");
        db.collection('Transfers').insertOne({ User: req.body.User, Email: req.body.Email, Amount: req.body.Amount }).then(
            res.redirect("/")
        ).catch((err) => {
            res.json({ masssage: "Transfer Failed" })
        });
    });
});
app.post('/Transfer', (req, res, next) => {
    const MongoClient = mongo.MongoClient;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) throw err;
        const db = client.db("SparkFoundation");
        db.collection('Transfers').find({}).toArray().then((Transfers) => {
            Transfers.forEach((Transfer) => {
                if (Transfer.User === req.body.User) {
                    var myquery = { User: req.body.User };
                    var newvalues = { $set: { Amount: parseInt(Transfer.Amount) + parseInt(req.body.Amount) } };
                    db.collection('Transfers').updateOne(myquery, newvalues, function (err, res) {
                        if (err) throw err;
                    });
                }
                if (Transfer.User === req.body.From) {
                    var myquery2 = { User: req.body.From };
                    var newvalues2 = { $set: { Amount: parseInt(Transfer.Amount) - parseInt(req.body.Amount) } };
                    db.collection('Transfers').updateOne(myquery2, newvalues2, function (err, res) {
                        if (err) throw err;
                    });
                }

            })
        }).then(
            res.redirect("/")
        ).catch((err) => {
            console.log(err);
        });
    });
});

const server = http.createServer(app);
server.listen(PORT);

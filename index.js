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
        const db = client.db("Spark_Foundation");
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
        const db = client.db("Spark_Foundation");
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
        const db = client.db("Spark_Foundation");
        db.collection('Transfers').find({}).toArray().then((Transfers) => {
            if(Transfers[0].User === req.body.User){
                var myquery = { User: req.body.User };
                var newvalues = { $set: {Amount:Transfers[0].Amount-req.body.Amount} };
                db.collection('Transfers').updateOne(myquery, newvalues, function(err, res) {
                    if (err) throw err;
            });
            res.redirect("/")
            }
     }).catch((err) => {
            console.log(err);
        });

    });
});

const server = http.createServer(app);
server.listen(PORT);

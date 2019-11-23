const express = require('express');
const secretKey = require('./api-key.json').secretKey;
const stripe = require('stripe')(secretKey);
const bodyParser = require('body-parser');
const expressHandleBar = require('express-handlebars');

const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

// MIDDLEWARE
app.engine('handlebars', expressHandleBar({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
  res.render('index', {
    stripePublicKey: require('./api-key.json').publicKey
  });
});

//Charge route
app.post('/charge', (req, res) => {
  const amount = 250000;

  let dataObject = {
    email: req.body.stripeEmail,
    token: req.body.stripeToken,
    amount: 2500
  };

  /* CREATING DATABSE WITH MONGODB */
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    var database = db.db('payments');
    database.collection('customers').insertOne(dataObject, (err, _res) => {
      if (err) throw err;
      db.close();
    });

    /* This will print all the customer in the database 
    database.collection("customers").find({}).toArray((err , result)=>{
        if (err) throw err;
        console.log(result);
        db.close();
    }); 
    */
  });

  /* HANDLING PROMISES */
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Demo on Payment',
        currency: 'inr',
        customer: customer.id
      })
    )
    .then(() => res.render('charge'))
    .catch(err => {
      console.log('Error:', err);
      res.status(500).send({ error: 'Purchase Failed' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

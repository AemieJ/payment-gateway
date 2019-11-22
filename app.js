const express = require('express');
const secretKey = require("./api-key.json").secretKey;
const stripe = require('stripe')(secretKey);
const bodyParser = require('body-parser');
const expressHandleBar = require('express-handlebars');

const app = express();
const port = 3000; 

// MIDDLEWARE
app.engine('handlebars' , expressHandleBar({defaultLayout:'main'}));
app.set('view engine' , 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/' , (req , res)=>{
  res.render('index' , {
    stripePublicKey: require("./api-key.json").publicKey
  });
});

//Charge route
app.post('/charge', (req, res) => {
  
  //console.log(req.body);
  const amount = 250000;
  /* HANDLING PROMISES */
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Demo on Payment",
      currency: "inr",
      customer: customer.id
  }))
  .then(charge => res.render('charge'))
  .catch(err => {
    console.log("Error:", err);
    res.status(500).send({error: "Purchase Failed"});
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
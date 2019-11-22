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

// Index Handlebar
app.get('/' , (req , res)=>{
  res.render('index');
});

//Charge route
app.post('/charge', (req, res) => {
  const amount = 2500;
  console.log(req.body);
  res.render('success');
  /*stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then((source)=>{
    return stripe.charges.create({
    amount: amount,
    description: 'Demo on Payment',
    currency: 'usd',
    customer: source.customer
  });
})
  .then(charge => res.render('success'))
  .catch(err => {alert('Error Occured')});*/
});

app.listen(port , ()=>{
  console.log(`Server is running on port ${port}`);
});
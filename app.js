const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session');
const router = require('./modules/Routes/userRoutes');
const passport = require('passport');
require('./modules/config/strategy')(passport);

// setting up an express app
const app = express();

//establishing the connect to the database and listening for requests

mongoose.connect(require('./modules/config/connect'), {useNewUrlParser : true})
.then(result => {app.listen(3000,() => {console.log('Listening for requests on port 3000')})})
.catch(err => {console.log(err)})


app.use(express.urlencoded({extended : true}));
//view engine middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  
  }));

  //passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
  app.use(flash());

  //setting up global variable

  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });

// Routes middleware
app.use('/user', router);

app.use((req, res) => {
    res.send('page not found');
});
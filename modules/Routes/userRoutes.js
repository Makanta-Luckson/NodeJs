const express = require('express');
const user = require('../Schema/schema');
const bcrypt = require('bcrypt');
const userModel = require('../Schema/schema');
const strategy = require('../config/strategy');
const passport = require('passport');
const {ensureAthenticated } = require('../config/authenticate');
const router = express.Router();



// rendering the registration
router.get('/register', (req, res) => {
    res.render('register', {title : 'Register'});
});


router.post('/register',(req, res) => {

  let {firstname, lastname, username, email, password, password2} = req.body;
  if(!firstname || lastname|| !username || !email || !password, !password2) {
      res.render('register');
  } else if(password !== password2) {
       res.send('password mismatch')
  } else if (password.length < 6) {
      res.send('password length should at atleast six characters');
  } else {

           
             userModel.findOne({email : email})
             .then(user => {
                 if (user) {
                     req.flash('error_msg', 'This email is already registered')
                     res.redirect('/user/register');
                 } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt,(err, hash) => {
                            if (err) {console.log(err)}
                            else {
                                password = hash;
                                const user = new userModel({firstname, lastname, username, email, password});
                                user.save()
                                .then(result => {
                                     req.flash('success_msg', 'You have registered successifully you can now sign in');
                                     res.redirect('/user/login');
                                })
                                .catch(err => (console.log(err)))

                            }
                        });
                    });
                 }
             })
             .catch(err => {console(err)});           
           
  }

});

router.get('/login', (req, res) => {
    res.render('login', {title : 'Sign in'});
});

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect : '/user/dashboard',
        failureRedirect : '/user/login',
        successFlash : true,
        failureFlash : true
    })(req, res, next);
});

router.get('/dashboard', ensureAthenticated,(req, res) => {
    req.flash('success_msg', 'you are logged in');
    res.render('dashboard', {title : 'user', name : req.user.username});
});

//logout handler
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You logged out')
    res.redirect('/user/login');
})

module.exports = router;
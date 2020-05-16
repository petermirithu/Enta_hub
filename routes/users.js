var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

// bring in user model
let User = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res) {
  res.render('register');
});

// register users
router.post('/register',function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is *required').notEmpty();
  req.checkBody('email', 'email is *required').notEmpty();
  req.checkBody('username', 'username is *required').notEmpty();
  req.checkBody('password', 'password is *required').notEmpty();
  req.checkBody('password2', 'password2 is *required').notEmpty();
  req.checkBody('password2', 'Password does not *match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });    
  }else{
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err,salt){
      bcrypt.hash(newUser.password, salt, function(err,hash){
        if(err){
          console.log(err);
        }
        newUser.password= hash
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;            
          }else{
            req.flash('success','You are now registered and can log in');
            res.redirect('/users/login');
          }
        })
      });
    })
  }
});

router.get('/login',function(req,res){
  res.render('login');
});

router.post('/login',function(req,res,next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true,
  })(req,res,next);
});

router.get('/logout',function(req,res){
  req.logOut();
  req.flash('success', ' Your Logged Out!');
  res.redirect('/')
})

module.exports = router;

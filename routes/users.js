const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const wrapAsync = require('../utilis/wrapAsync');


router.get('/register', (req,res)=>{
    res.render('users/register');
});

router.post('/register', wrapAsync(async (req,res)=>{
    try{
    const {username,email,password}= req.body;
    const nw = new User({email,username});
    const ru = await User.register(nw,password);
    req.login(ru, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    })
    req.flash('success',"Welcome to Yelp Camp!!");
    res.redirect('/campgrounds');}
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req,res)=>{
          req.flash('success',"Welcome back!!");
          const nurl = req.session.returnTo || '/campgrounds';
          delete req.session.returnTo;
          res.redirect(nurl);
})

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success','Goodbye!!');
    res.redirect('/campgrounds');
})

module.exports = router;
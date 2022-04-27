const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utilis/wrapAsync');
const user = require('../controllers/user');

router.route('/register').
        get((req,res)=>{
        res.render('users/register');
        }).
        post(wrapAsync(user.register));

router.route('/login').
get((req,res)=>{
    res.render('users/login');
}).
post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),wrapAsync(user.login));

router.get('/logout',wrapAsync(user.logout));

module.exports = router;
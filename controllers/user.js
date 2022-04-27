const User = require('../models/user');

module.exports.register = async (req,res)=>{
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
}

module.exports.login = (req,res)=>{
    req.flash('success',"Welcome back!!");
    const nurl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(nurl);
}

module.exports.logout = (req,res)=>{
    req.logOut();
    req.flash('success','Goodbye!!');
    res.redirect('/campgrounds');
    }
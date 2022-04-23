const campground = require("./models/campground");
const review = require('./models/review');
const {JoiSchema} = require('./Schema');
const ExpressError = require('./utilis/ExpressError');
const {JoiReview} = require('./Schema');

module.exports.isLogedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be SignIn');
        return res.redirect('/login');
     }
     next();
}

module.exports.isSameUser = async (req,res,next)=>{
    const us = await campground.findById(req.params.id);
    if(us.author.equals(req.user._id)){
        next();
    }
    else{
        req.flash('error',"You not owned this campground");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
}

module.exports.validateCampground = (req,res,next)=>{
    const {error} = JoiSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(401,msg);
    }
    else{
        next();
    }
}

module.exports.ValidateReview=(req,res,next)=>{
    const {error} = JoiReview.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(401,msg);
    }
    else{
        next();
    }
}

module.exports.isSameReview = async (req,res,next)=>{
    const us = await review.findById(req.params.reviewId);
    if(us.author.equals(req.user._id)){
        next();
    }
    else{
        req.flash('error',"it is not your review");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
}
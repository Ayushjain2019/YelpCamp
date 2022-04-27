const Campground=require('../models/campground');
const Review = require('../models/review');

module.exports.newReview = async(req,res,next)=>{
    const camp = await Campground.findById(req.params.id);
    //const {rating, review} = req.body;
    const rs = await new Review(req.body.review);
    rs.author=req.user._id;
    camp.reviews.push(rs);
    //res.send(rs);
    await rs.save();
    await camp.save();
    req.flash('success','Successfully Added Review!!');
    res.redirect(`/campgrounds/${camp._id}`);
 }

module.exports.deleteReview = async (req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    //res.send("Deleted!!!");
    req.flash('success','Successfully Deleted Review!!');
    res.redirect(`/campgrounds/${req.params.id}`);
 }
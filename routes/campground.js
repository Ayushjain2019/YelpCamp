const express = require('express');
const router = express.Router();
const Campground=require('../models/campground');
const {isLogedin, isSameUser, validateCampground} = require('../middleware');
const wrapAsync = require('../utilis/wrapAsync');
  
router.get('/', async (req,res)=>{
    const fd = await Campground.find({});
    res.render('campgrounds/index', { fd })
})

router.post('/', validateCampground, wrapAsync(async (req,res,next)=>{
         // res.send(req.body);
         const cmp = new Campground(req.body.campground);
         cmp.author = req.user._id;
         await cmp.save();
         req.flash('success','Successfully Added new Campground!!');
         res.redirect('/campgrounds');
}))

router.get('/nw', isLogedin,(req,res) => {
   res.render('campgrounds/nw');
})

router.get('/:id', wrapAsync(async (req,res,next)=>{
   const camp = await Campground.findById(req.params.id).populate('author').populate({
      path:'reviews',
   populate:{
      path:'author'
   }});
   if(!camp){
      req.flash('error',"Not found that campground!!");
      res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { camp });
}));

router.get('/:id/edit',isLogedin,async (req,res)=>{
   const camp = await Campground.findById(req.params.id);
   if(!camp){
      req.flash('error',"Not found that campground!!");
      res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { camp });
})

router.put('/:id', isLogedin, isSameUser, async (req,res)=>{
   const {id} = req.params;

   const camp= await Campground.findByIdAndUpdate(id,{...req.body.campground});
   if(!camp){
      req.flash('error',"Not found that campground!!");
      res.redirect('/campgrounds');
   }
   req.flash('success','Update Campground Successfully!!');
   res.redirect(`/campgrounds/${camp._id}`);

})

router.delete('/:id', isLogedin, isSameUser, async (req,res)=>{
   const {id}=req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success','Delete Campground Successfully!!');
   res.redirect('/campgrounds');
})

module.exports = router;
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground=require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
   // useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection Error: "));
db.once("open", ()=>{
    console.log("Database Connected");
});

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.listen(3000,()=>{
    console.log('Hi!I am listening');
})

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
   // res.send("Hello!!");
   res.render('home');
})


app.get('/campgrounds', async (req,res)=>{
     const fd = await Campground.find({});
     res.render('campgrounds/index', { fd })
})

app.post('/campgrounds', async (req,res)=>{
          // res.send(req.body);
          const cmp = new Campground(req.body.campground);
          await cmp.save();
          res.redirect('/campgrounds');
})

app.get('/campgrounds/nw', (req,res) => {
    res.render('campgrounds/nw');
})

app.get('/campgrounds/:id', async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { camp });
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp });
})

app.put('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;

    const camp= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    
    res.redirect(`/campgrounds/${camp._id}`);

})

app.delete('/campgrounds/:id', async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

/*app.get('/makecampground',async (req,res)=>{
    const camp = new Campground({
        title:'dausa',price:"100rs"
    });
    await camp.save();
    res.send(camp);
*/

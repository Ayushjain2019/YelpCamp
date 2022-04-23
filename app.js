const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ExpressError = require('./utilis/ExpressError');
const session = require('express-session');
const campground = require('./routes/campground'); 
const review = require('./routes/review');
const user = require('./routes/users');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    //useCreateIndex:true,
    useUnifiedTopology:true
   // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection Error: "));
db.once("open", ()=>{
    console.log("Database Connected");
});

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.listen(3000,()=>{
    console.log('Hi!I am listening');
})

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const sessionConfig = { 
    secret:'goodsecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error= req.flash('error');
    next();
})

app.get('/',(req,res)=>{
   // res.send("Hello!!");
   res.render('home');
})

app.use('/campgrounds',campground);
app.use('/campgrounds/:id/review',review);
app.use('/',user);
app.use(express.static(path.join(__dirname,'public')));

app.all('*',(req,res,next)=>{
   // res.send("404!!!");
   next(new ExpressError(404,"Not Found"));
})

app.use((err,req,res,next)=>{
     // res.send("Error!!!")  
  const {status=501,message="Error"}=err;
    res.status(status).render('error',{err});
})

/*app.get('/makecampground',async (req,res)=>{
    const camp = new Campground({
        title:'dausa',price:"100rs"
    });
    await camp.save();
    res.send(camp);
*/

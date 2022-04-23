const mongoose = require('mongoose');
const Campground=require('../models/campground');
const cities= require('./cities');
const { places, descriptors } = require('./seedHelper');

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

//const sample = array =>  array[Math.floor(Math.random()*array.length)];

const sample = array => array[Math.floor(Math.random() * array.length)];

const renewDb = async()=>{

    await Campground.deleteMany({});
    
    for(let i=0;i<5;++i){
        const rand= Math.floor(Math.random()*10);
        const r = Math.floor(Math.random()*15);
        const nd = new Campground({
        author:'6210d64dd6b921525cec6379',    
        location:`${cities[rand].city},${cities[rand].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        image:"https://source.unsplash.com/collection/483251"
    });
    await nd.save();
    }
}

renewDb().then(() => {
    mongoose.connection.close();
})
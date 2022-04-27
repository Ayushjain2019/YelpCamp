const express = require('express');
const router = express.Router();
const {isLogedin, isSameUser, validateCampground} = require('../middleware');
const wrapAsync = require('../utilis/wrapAsync');
const camp = require('../controllers/campgrounds');  
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/').
get(wrapAsync(camp.index))
.post(isLogedin, upload.array('image'), validateCampground, wrapAsync(camp.createCampground));

router.get('/new', isLogedin,(req,res) => {
   res.render('campgrounds/new');
})

router.get('/:id/edit',isLogedin,wrapAsync(camp.editCampground));

router.route('/:id').get(wrapAsync(camp.showCampground)).
put(isLogedin, isSameUser, upload.array('image'),wrapAsync(camp.updateCampground)).
delete(isLogedin, isSameUser, wrapAsync(camp.deleteCampground));

module.exports = router;
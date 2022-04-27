const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utilis/wrapAsync');
const {ValidateReview, isLogedin, isSameReview} = require('../middleware');
const {newReview,deleteReview} = require('../controllers/review');

router.post('/', ValidateReview, isLogedin, wrapAsync(newReview));

router.delete('/:reviewId',isLogedin, isSameReview, wrapAsync(deleteReview));

module.exports = router;
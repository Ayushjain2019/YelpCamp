const Joi = require('joi');
const { number } = require('joi');

module.exports.JoiSchema=Joi.object({
         campground:Joi.object({
         title:Joi.string().required(),
         location:Joi.string().required(),
    }).required(),
    deleteImages:Joi.array()
});

module.exports.JoiReview=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});
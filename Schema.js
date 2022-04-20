const Joi = require('joi');

module.exports.JoiSchema=Joi.object({
         campground:Joi.object({
         title:Joi.string().required(),
         location:Joi.string().required(),
         image:Joi.string().required()
    }).required()
});
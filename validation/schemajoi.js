const joi = require("joi");
module.exports.listingSchema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      image: {
        filename: joi.string().allow("", null),
        url: joi.string().allow("", null),
      },
      price: joi.number().required().min(0),
      location: joi.string().required(),
      country: joi.string().required(), 
      reviews:joi.array().items(
       joi.object(
        { comment:joi.string().required(),
        rating:joi.number().min(1).max(5),
        }
      ))
});
module.exports.reviewSchema = joi.object({
  review:joi.object({ 
      comment: joi.string().required(),
      rating: joi.number().required().min(1).max(5)}).required()
});

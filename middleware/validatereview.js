const { reviewSchema } = require("../validations/schemajoi");
const ExpressError = require("../utils/expressError");
module.exports = (req, res, next) => {
  // console.log("validate");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

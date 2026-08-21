const Review = require("../models/review");
module.exports = async (req, res, next) => {
  let { listid, reviewid } = req.params;
  let reviewINFO = await Review.findById(reviewid).populate("author");
  if (reviewINFO && !req.user._id.equals(reviewINFO.author._id)) {
    req.flash("error", "You are not the author of this");
    return res.redirect(`/listings/${listid}`);
  }
  next();
};

const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const review = express.Router({ mergeParams: true });
const {
  validatereview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/middleware");
const reviewController=require("../controllers/reviews")
//joy function
review.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(reviewController.reviewNew),
);
// /using pull op
review.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.reviewdelete),
);
module.exports = review;

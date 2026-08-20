const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const review = express.Router({ mergeParams: true });
const listing = require("../model/Listing");
const Review = require("../model/review");
const {
  validatereview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/middleware");
//joy function
review.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(async (req, res) => {
    console.log(req.params);
    const id = req.params.listid;
    const list = await listing.findById(id);
    let newReview = new Review(req.body.review);
    list.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await list.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${id}`);
  }),
);
// /using pull op
review.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { listid, reviewid } = req.params;
    await listing.findByIdAndUpdate(listid, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "review Deleted");
    res.redirect(`/listings/${listid}`);
  }),
);
module.exports = review;

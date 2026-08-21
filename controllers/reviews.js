const listing = require("../models/Listing");
const Review = require("../models/review");
module.exports.reviewNew=async (req, res) => {
    const id = req.params.listid;
    const list = await listing.findById(id);
    let newReview = new Review(req.body.review);
    list.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await list.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${id}`);
  }

  module.exports.reviewdelete=async (req, res) => {
      let { listid, reviewid } = req.params;
      await listing.findByIdAndUpdate(listid, { $pull: { reviews: reviewid } });
      await Review.findByIdAndDelete(reviewid);
      req.flash("success", "review Deleted");
      res.redirect(`/listings/${listid}`);
    }
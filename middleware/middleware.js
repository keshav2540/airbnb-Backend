const listing = require("../model/Listing");
const { listingSchema, reviewSchema } = require("../validation/schemajoi");

const ExpressError = require("../utils/expressError");
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user, "..", req.path, " ..", req.originalUrl);
  if (!req.isAuthenticated()) {
     if (req.method === "GET") {
   req.session.redirectUrl = req.originalUrl;
     }
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.validatereview = (req, res, next) => {
  console.log("validate");
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.validateListing = (req, res, next) => {
  let list = req.body;
  let newlist = {
    ...list,
    image: {
      filename: "listingimage",
      url: list.image,
    },
  };
  let { error } = listingSchema.validate(newlist);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  if (!req.user || !list.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permission to edit owner is diffrent");
   return  res.redirect(`/listings/${id}`);
  }
  next();
};

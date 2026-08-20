const listing = require("../model/Listing");
module.exports = async (req, res, next) => {
  let { id } = req.params;
  let list = await listing.findById(id);
  if (!req.user || !list.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permission to edit owner is diffrent");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

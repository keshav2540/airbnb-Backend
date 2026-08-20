const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const list = express.Router({ mergeParams: true });
const listing = require("../model/Listing");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../validation/schemajoi");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware");

list.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }),
);

list.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});
list.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing
      .findById(id)
      .populate(
        {path :"reviews",
        populate:{
          path:"author"
        }
         }
         )
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing you request for does not exist");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { list });
  }),
);
list.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you request for Edit does not exist");
      return res.redirect("/listings");
    }
    console.log(list);
    res.render("./listings/edit.ejs", { list });
  }),
);
list.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let list = req.body;
    let newlist = {
      ...list,
      image: {
        filename: "listingimage",
        url: list.image,
      },
    };
    const newListing = new listing(newlist);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New List Added");
    res.redirect("/listings");
  }),
);
list.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let list = req.body;
    let newlist = {
      ...list,
      image: {
        filename: "listingimage",
        url: list.image,
      },
    };
    await listing.findByIdAndUpdate(id, { ...newlist }, { new: true });
    req.flash("success", "List Updated");
    res.redirect(`/listings/${id}`);
  }),
);
list.delete(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletelist = await listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success", "Home Deleted");
    res.redirect(`/listings`);
  }),
);

module.exports = list;

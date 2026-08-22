const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const list = express.Router({ mergeParams: true });
const listing = require("../models/Listing");
const multer = require("multer");
const {cloudinary,storage} =require("../cloudConfig");
const upload = multer({ storage });
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware");
const listingController = require("../controllers/listings");

list
.route("/")
.get( wrapAsync(listingController.index))
.post(
  isLoggedIn, 
   upload.single('image'),
  validateListing,
  wrapAsync(listingController.addNewList),
);


list.get("/new", isLoggedIn, listingController.renderNewForm);
list.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.Edit));

list
.route( "/:id")
.get(wrapAsync(listingController.renderShow))
.put(
  isLoggedIn,
  isOwner,
  upload.single('image'),
  validateListing,
  wrapAsync(listingController.update),
)
.delete(isOwner, isLoggedIn, wrapAsync(listingController.delete));

module.exports = list;

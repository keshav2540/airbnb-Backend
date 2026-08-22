const listing=require("../models/Listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
let mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req, res) => {
    const allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }
module.exports.renderNewForm=(req, res) => {
  res.render("./listings/new.ejs");
}
module.exports.renderShow=async (req, res) => {
    const { id } = req.params;
    const list = await listing
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing you request for does not exist");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { list });
  }


module.exports.Edit=async (req, res) => {
    const { id } = req.params;
    const list = await listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you request for Edit does not exist");
      return res.redirect("/listings");
    }
    let originalImage=list.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { list ,originalImage});
  }
module.exports.addNewList=async (req, res) => {
 let response=await geocodingClient.forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
  .send()  
    let list = req.body;
    let newlist = {
      ...list,
      image: {
        filename: req.file.filename,
        url: req.file.path,
      },
    };
    const newListing = new listing(newlist);
    newListing.owner = req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    savedList=await newListing.save();
    console.log(savedList);
    req.flash("success", "New List Added");
    res.redirect("/listings");
  }
module.exports.update=async (req, res) => {
   const { id } = req.params;
   let list = await listing.findById(id);
    if(!list){
         req.flash("error", "Listing not found");
         return res.redirect("/listings");
    }
    let updatedlist={...req.body};
    if(typeof req.file !=="undefined"){
       updatedlist.image = {
       filename: req.file.filename,
       url: req.file.path,
     }
    }
    else{
        updatedlist.image=list.image;
      }

  if (req.body.location !== list.location){
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
    updatedlist.geometry = response.body.features[0].geometry;
  } 
    Updated=await listing.findByIdAndUpdate(id, { ...updatedlist }, { new: true });
    console.log(Updated);
    req.flash("success", "List Updated");
    res.redirect(`/listings/${id}`);
  }
module.exports.delete=async (req, res) => {
    const { id } = req.params;
    let deletelist = await listing.findByIdAndDelete(id);
    // console.log(deletelist);
    req.flash("success", "Home Deleted");
    res.redirect(`/listings`);
  }
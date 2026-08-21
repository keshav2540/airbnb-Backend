const listing=require("../models/Listing");
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
    res.render("./listings/edit.ejs", { list });
  }
module.exports.addNewList=async (req, res) => {
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
    await newListing.save();
    req.flash("success", "New List Added");
    res.redirect("/listings");
  }
module.exports.update=async (req, res) => {
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
  }
module.exports.delete=async (req, res) => {
    const { id } = req.params;
    let deletelist = await listing.findByIdAndDelete(id);
    req.flash("success", "Home Deleted");
    res.redirect(`/listings`);
  }
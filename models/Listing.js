const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");
const { required } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSpoTISDgiYQNaRQGXeo345145vFr25T8LbHLocLTnNo1jyAT4GnVnG2gh1EDuNG12Tk4DCEbtw75fqV1ZOSRtexmJqvAYx",
      set: (V) =>
        V === "" ?
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSpoTISDgiYQNaRQGXeo345145vFr25T8LbHLocLTnNo1jyAT4GnVnG2gh1EDuNG12Tk4DCEbtw75fqV1ZOSRtexmJqvAYx"
        : V,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  geometry: {
    type: { 
       type:String
      , enum: ["Point"],
       required: true },
    coordinates: {
      type:[Number],
      required: true,
    },
  },
});
listingSchema.post("findOneAndDelete", async (list) => {
  if (list) {
    res = await Review.deleteMany({ _id: { $in: list.reviews } });
    // console.log(res);
  }
});
const listing = mongoose.model("listing", listingSchema);
module.exports = listing;

const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;
const userSchema = new Schema({
  //   username: {
  //     type: String,
  //     required: true,
  //   },  /// auto implement passport-local-mongoose
  //   password: {
  //     type: String,
  //     required: true,
  //   },
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passportLocalMongoose);
//automatic usename,password hashing , salting
module.exports = mongoose.model("User", userSchema);

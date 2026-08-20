const { listingSchema } = require("../validation/schemajoi");
const ExpressError = require("../utils/expressError");
module.exports = (req, res, next ) => {
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

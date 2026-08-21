const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware");
const usersController=require("../controllers/users")
router
.route("/signup")
.get(usersController.signUp)
.post(
  wrapAsync(usersController.signInfoSave),
);
router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 usersController.login
);
router.get("/logout", usersController.logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../model/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware");

router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        email,
        username,
      });
      registerUser = await User.register(newUser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to WanderLust !");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
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
  async (req, res) => {
    try {
      let { username, password } = req.body;
      req.flash("success", "welcome back to WanderLust");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/login");
    }
  },
);
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are LogOut Now");
    res.redirect("/listings");
  });
});

module.exports = router;

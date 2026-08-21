const User = require("../models/user");
module.exports.signUp = (req, res) => {
  res.render("./users/signup.ejs");
};
module.exports.signInfoSave = async (req, res) => {
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
};
module.exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;
    req.flash("success", "welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/login");
  }
};
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are LogOut Now");
    res.redirect("/listings");
  });
};
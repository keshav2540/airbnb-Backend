module.exports = (req, res, next) => {
  // console.log(req.user, "..", req.path, " ..", req.originalUrl);
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

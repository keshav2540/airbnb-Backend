require("dotenv").config({ quiet: true });
const express = require("express");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const mongo_url = process.env.mongo_url;
const app = express();
const Port = process.env.Port;
const list=require("./routes/listing");
const review = require("./routes/review");
const ExpressError=require("./utils/expressError");
const session=require("express-session");
const flash=require('connect-flash')
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user");
const userRouter=require("./routes/user")
const sessionOption = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
    // expires:Date.now()+7*24*60*60*1000, weak
  },
};
main()
  .then(() => {
    console.log("connectd to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(session(sessionOption));
app.use(flash());
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user
  next();
})

app.get("/demouser",async(req,res)=>{
  let fakeuser=new User({
    email:"@keshva",
    username:"allu"
  })
  let registeruser=await User.register(fakeuser,"helloworld");
  res.send(registeruser);
})


async function main() {
  await mongoose.connect(mongo_url);
}
app.get("/", (req, res) => {
  console.log("meow");
});
app.use("/listings",list);
app.use("/listings/:listid/reviews",review);
app.use('/' , userRouter);
app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "page not Found"));
});
app.use((err, req, res, next) => {
  console.log(err);
  let {statusCode=500,message="somethingwent wrong"}=err;
  res.status(statusCode).render("error.ejs",{err});
});
app.listen(Port, () => {
  console.log(`sever is runnig on ${Port}`);
});

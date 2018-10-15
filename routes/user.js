var router = require("express").Router();
var User = require("../models/user");
var Cart = require("../models/cart");
var waterfall = require("async-waterfall");
var passport = require("passport");
var passportConf = require("../config/passport");

router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("accounts/login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    faliureRedirect: "/login",
    failureFlash: true
  })
);
// profile route
router.get("/profile", passportConf.isAuthenticated, (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate("history.item")
    .exec(function(err, user) {
      if (err) return next(err);
      res.render("./accounts/profile", { user: user });
    });
});

router.get("/signup", (req, res, next) => {
  res.render("accounts/signup", {
    errors: req.flash("errors")
  });
});

router.post("/signup", (req, res, next) => {
  waterfall([
    function(callback) {
      var user = new User();

      (user.profile.name = req.body.name),
        (user.email = req.body.email),
        (user.password = req.body.password),
        (user.profile.picture = user.gravatar());
      //console.log(req.body.password);

      User.findOne({ email: req.body.email }, (err, existinguser) => {
        if (existinguser) {
          req.flash("errors", "Account with that email address already exists");
          return res.redirect("/signup");
        } else {
          user.save((err, user) => {
            if (err) return next(err);
            callback(null, user);
          });
        }
      });
    },
    function(user) {
      var cart = new Cart();
      cart.owner = user._id;
      cart.save(err => {
        if (err) return next(err);
        req.logIn(user, err => {
          if (err) return next(err);
          res.redirect("/profile");
        });
      });
    }
  ]);

  // newuser.save()
  // .then(usr =>{
  // 	res.json('succesfully created');
  // })
  // .catch(err => {
  //            res.status(400).send("Unable to save to database");
  // 	});
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/edit-profile", (req, res, next) => {
  res.render("accounts/edit-profile", { message: req.flash("success") });
});

router.post("/edit-profile", (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) return next(err);
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    user.save(err => {
      if (err) return next(err);
      req.flash("success", "Successfully edited your profile");
      return res.redirect("/edit-profile");
    });
  });
});

module.exports = router;

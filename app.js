var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var engine = require("ejs-mate");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("express-flash");
var MongoStore = require("connect-mongo")(session);
//store session on mongodb
var passport = require("passport");

var secret = require("./config/secret");
var User = require("./models/user");
var Category = require("./models/category");
var cartLength = require("./middlewares/middlewares");

var app = express();
var methodOverride = require("method-override");
var path = require("path");

// secret.database
mongoose.Promise = global.Promise;
mongoose.connect(
  secret.database,
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to the database");
    }
  }
);
//middleware
//keep track of operations in the application
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //complex algo for parsing

app.use(methodOverride("_method"));

app.use(cookieParser());
//app.use(flasha());
app.use(
  session({
    secret: secret.secretKey,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//middleware run for every single route
app.use(function(req, res, next) {
  res.locals.user = req.user;
  //res.locals.error = req.flash("error");
  //res.locals.success = req.flash("success");
  next();
}); //added this to every template and every route
//will have currentuser available equal to currently logged-in user

app.use(cartLength);

app.use((req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) next(err);
    res.locals.categories = categories;
    next();
  });
});

app.engine("ejs", engine);
app.set("view engine", "ejs");

var mainRoutes = require("./routes/main");
var userRoutes = require("./routes/user");
var adminRoutes = require("./routes/admin");
var apiRoutes = require("./api/api");

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use("/api", apiRoutes);

app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is running");
});

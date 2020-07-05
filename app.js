var express     = require("express"),
	app         = express(),
	bodyParser  = require("body-parser"),
	mongoose    = require("mongoose"),
	flash       = require("connect-flash"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Campground  = require("./models/articles"),
	Comment     = require("./models/comment"),
	User        = require("./models/user"),
    seedDB      = require("./seeds");

// Requiring routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/articles"),
	indexRoutes      = require("./routes/index");





mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/yelp_camp")
mongoose.connect("mongodb+srv://Sutharseehan:sutha1606@cluster0.esgpg.mongodb.net/<dbname>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}). then(() => {
	console.log("Connected to DB!");
}). catch(err => {
	console.log("ERROR:", err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/articles", campgroundRoutes);
app.use("/articles/:id/comments", commentRoutes);


// app.listen(3000, () => {
// 	console.log("SERVER IS RUNNING");
// });
	

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);










	
	
	
	
	
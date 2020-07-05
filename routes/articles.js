var express = require("express");
var router  = express.Router();
var Campground = require("../models/articles");
var middleware = require("../middleware");

//INDEX - show all campgrounds

router.get("/", function(req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("articles/index",{campgrounds: allCampgrounds, currentUser: req.user, page: 'articles'});
		}
	});
});

//CREATE - add new campground to DB

router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//Redirect back to campgrounds page
			res.redirect("/articles");
		}
	});
});

//NEW - show form to create new campground

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("articles/new")
});


//SHOW - shows more info about one campground

router.get("/:id", function(req, res){
	//Find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			console.log(foundCampground);
			//Render show template with that campground
			res.render("articles/show", {campground: foundCampground});	
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	//Is user logged in
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("articles/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/articles");
		} else {
			res.redirect("/articles/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/articles");
		} else {
			res.redirect("/articles");
		}
	});
});



module.exports = router;












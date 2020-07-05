var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/articles");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	//Find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});


// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	// Lookup campground using ID	
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/articles");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					//Add username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/articles/" + campground._id);
				}
			});
		  };
	});

});


// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/articles/" + req.params.id);
		}
	});
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	 Comment.findByIdAndRemove(req.params.comment_id, function(err){
		 if(err){
			 res.redirect("back");
		 } else {
			 req.flash("success", "Comment deleted")
			 res.redirect("/articles/" + req.params.id);
		 }
	 });
});



module.exports = router;



















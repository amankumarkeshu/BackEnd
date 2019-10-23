var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
Campground = require("./models/campground"),
    seedDb = require("./seeds");
// Comment =require("./model/comment")


mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useUnifiedTopology: true, useNewUrlParser: true }); //create yelpcamp db inside mongodb

app.use(bodyParser.urlencoded({
    extended: true
}));


app.set("view engine", "ejs");


// call seeds.js
seedDb();

// SCHEMA SETUP No need now already present in campground .js in model

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                campgrounds: allCampgrounds
            }); //data + name passing in
        }
    });

});

//CREATE - add new campgrounds to database
app.post("/campgrounds", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: desc
    };
    //create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds"); //
        }
    });
});

//NEW - show form to create new campground 
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs")
});

//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground

            res.render("show", {
                campground: foundCampground

            });
        }
    });
});
// app.get("/campgrounds/:id", function(req, res){
//     //find the campground with the provided ID
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
//        if (err) {
//            console.log(err);
//        } else {
//             //render show template with that campground
//            res.render("show", {campground: foundCampground});
//        }
//     });
// });



app.listen(3000, function() {
    console.log(" Jai shree ram YelpCamp server has started!");
});
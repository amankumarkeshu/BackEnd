var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),

    Campground = require("./models/campground"),
    seedDb = require("./seeds"),
    Comment = require("./models/comment");


mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useUnifiedTopology: true, useNewUrlParser: true }); //create yelpcamp db inside mongodb

app.use(bodyParser.urlencoded({
    extended: true
}));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));




// call seeds.js
seedDb();
// Passport Configuration
app.use(require('express-session')({
    secret: "Once again rusty wins the cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// SCHEMA SETUP No need now already present in campground .js in model

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX ROUTE - show all campgrounds

app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    //console.log(req.user);
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
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
    res.render("campgrounds/new.ejs");
});


//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground

            //campground: foundCampground
            console.log(foundCampground);

            res.render("campgrounds/show", {
                campground: foundCampground

            });



        }
    });
});

//Comment routes  : 1.New comment page ,  2 .Adding comment and merging with the campground

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }

    });

});

// adding new comment and rendering to its show page
app.post("/campgrounds/:id/comments", function(req, res) {


    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");

        } else {


            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);

                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);

                }

            });
        }
    });

});
//======================================================
//AUTH ROUTES
//=======================================================

app.get("/register", function(req, res) {
    res.render("register");

});
//Handle user sign up
app.post("/register", function(req, res) {
    var newuser = new User({ username: req.body.username });

    User.register(newuser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");

        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");

        });

    });


});
//========================================================
//LOGIN routes

app.get("/login", function(req, res) {
        res.render("login");

        //res.redirect("/campgrounds");


    })
    //HAndle login page
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

}), function(req, res) {

});

//LOGOUT ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})


//Is login check for adding comments
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function() {
    console.log(" Jai shree ram YelpCamp server has started!");
});
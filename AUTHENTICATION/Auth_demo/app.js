var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    User = require('./models/user'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/Auth_demo", { useUnifiedTopology: true, useNewUrlParser: true });
var app = express();
app.set('view engine', 'ejs');

//app.use codes
//============================================
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('express-session')({
    secret: "Rusty is the best and the cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//=========================================
//we don't have to write authenticate method bcos of this 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=======================================================
//ROUTES
//======================================
app.get("/", function(req, res) {
    res.render("home");

});

app.get("/secret", isLoggedIn,
    function(req, res) {
        res.render("secret");

    });

//============================================
//AUTH ROUTES
//=================================
// Take it to the form page
app.get("/register", function(req, res) {
    res.render("register");

});

// Handling user signup ,Put the data into the database 

app.post("/register", function(req, res) {
    req.body.username;
    req.body.password;
    User.register(({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");
        })

    });

})

//Render LOGIN  form
//============================================
app.get("/login", function(req, res) {
    res.render("login");

});

// Authenticate User Login
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "login"
}), function(req, res) {

});

//===================================================
//logout route 
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});
// middleware function
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    }
    res.redirect("/login");
}
app.listen(5001, function() {

    console.log("Jai Shree Ram ... Server has started");

});
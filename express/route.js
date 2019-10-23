console.log("our first express app");

var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("Hi there this is root");

});

app.get("/dogs", function(req, res) {
    res.send("hi this is dogs");

});


app.get("/bye", function(req, res) {
    res.send("good bye");

});


app.get("/r/comments/:subredditName/:id/:title", function(req, res) {
    var sub = req.params.subredditName;
    console.log(req.params);


    console.log("Hi u are in " + sub);
    res.send("welcome to comments page");


})


app.get("*", function(req, res) {
    res.send("wrong ");

});

app.listen(5000, function() {
    console.log("server has started");

});
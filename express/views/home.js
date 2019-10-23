var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("Hi this is root");

});

app.get("/fellinlovewith/:goo", function(req, res) {

    var thing = req.params.goo;

    console.log(thing);
    res.render("love.ejs", { thingvar: thing });


    //  res.send("Hi this is dogs " + thing);

});



app.listen(5000, function() {
    console.log("server has started");

})
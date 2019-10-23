var mongoose = require("mongoose");
var express = require('express');
var app = express();

mongoose.connect("mongodb://localhost");


app.get("/blogs", function(req, res) {


})
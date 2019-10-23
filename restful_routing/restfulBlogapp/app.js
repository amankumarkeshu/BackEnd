var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();




mongoose.connect('mongodb://localhost:27017/myapp', { useUnifiedTopology: true, useNewUrlParser: true });
//this is app config    



app.set("view engine", "ejs");
app.use((express.static("public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// mongoose.set('useFindAndModify', false); 
// mongoose.set('useFindAndModify', false);


// make a schema the compile 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }

});

//compile  into an model

var Blog = mongoose.model("Blog", blogSchema);
// restful routes


// Blog.create({
//     title: "my name is aman",
//     body: "my height is  feet and weight 75 kgs",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_nFciUIai-C2R3WkaT19f9yr0wWjS7-d0t_P5adO42mXJWzdQEg",
//     date: Date.now
// }, function(err, blogdata) {
//     if (err) {
//         console.log("OOPS there's an error");

//     } else {
//         console.log(blogdata);
//     }
// });

// index blogs
app.get("/", function(req, res) {
    res.redirect("/blogs");
});


app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blog) {
        if (err) {
            console.log("OOPS there's an error");

        } else {
            res.render("index.ejs", { blog: blog });
        }
    });


});

// new blog
app.get("/blogs/new", function(err, res) {
    res.render("new");

});

// create blog
app.post("/blogs", function(req, res) {
    var blog = req.body.blog;
    Blog.create(blog, function(err, data) {
        if (err) {
            console.log("theres an error in post");
        } else {
            console.log(data.title);

            res.redirect("/blogs");

        }
    });


});
// show one particular blog
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, data) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: data });

        }
    })
});


//edit form of the blog
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { blog: data });

        }

    })


});
// after editing in the form update it
app.put("/blogs/:id", function(req, res) {

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {

            res.redirect("/blogs");

        } else {
            console.log(updatedBlog);
            res.redirect("/blogs/" + req.params.id);

        }
    })

});





app.listen(5000, function() {
    console.log(" Jai shree Ram! Server has been started");
});
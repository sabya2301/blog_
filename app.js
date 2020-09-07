var express 		= require("express"),
	methodOverride 	= require("method-override"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose		= require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname + '/public'));
app.use("/partials", express.static("partials"));
app.use(methodOverride("_method"));

//mongoose
var blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "",
// 	body: "This is a demo entry"
// });

// Blog.create({
// 	title: "Demo",
// 	image: "https://images.unsplash.com/photo-1595535319207-db0a910e4a92?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body: "demo blog",

// })
//RESTful Routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index.ejs", {blogs: blogs});
		}
	})
});

//NEW route
app.get("/blogs/new", function(req, res){
	res.render("new.ejs");
});

//CREATE route
app.post("/blogs", function(req, res){
	//create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	})
	//redirect
});

//SHOW route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log(err);
		}else{
			res.render("show.ejs", {foundBlog: foundBlog});
		}
	})
});

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log(err);
		}else{
			res.render("edit.ejs", {editBlog: foundBlog});
		}
	})
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){ //(oldID, newData, callback)
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs/" +req.params.id);
		}
	})
});

//DELETE route
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/");
		}
	})
});


app.listen(3000, function(req,res){
	console.log("The restful_blog_app server has started...");
});


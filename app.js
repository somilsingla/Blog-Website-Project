const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogdb");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postsSchema = {
    name: String,
    body: String,
};

const Post = mongoose.model("Post", postsSchema);

app.get("/", function(req, res){

    Post.find({}, function(err, postList){
        if(err){
            console.log(err);
        }
        else{
            if(postList.length == 0){
                const initalPost = new Post({
                    name: "Welcome To My Blog",
                    body: "This is my blog website. I post about myself and my new learnings here every week, join here for learning about programming and stock market.",
                });

                initalPost.save(function(err){
                    if(!err){ res.redirect("/"); }
                })
            }
            else{
                res.render("home", {content: homeStartingContent, posts: postList});
            }
        }
    })

});

app.get("/about", function(req, res){
    res.render("about", {content: aboutContent});
});

app.get("/contact", function(req, res){
    res.render("contact", {content: contactContent});
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.get("/posts/:post_id", function(req, res){
    //console.log(req.params.post_id);
    const itemId = req.params.post_id;

    Post.findById(itemId, function(err, post){
        if(err){
            console.log(err);
        }
        else{
            res.render("post", {post: post});
        }
    })

});

app.post("/compose", function(req, res) {
    const newPost = new Post({
        name : req.body.postTitle,
        body : req.body.postBody,
    });

    newPost.save(function(err){
        if(!err){ res.redirect("/"); }
    });
});

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
})

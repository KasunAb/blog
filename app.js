//jshint esversion:6

const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// include mongoose in our project and open a connection to the blogDB database on our locally running instance of MongoDB.
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nimmi:nimmi123@cluster0.hvls5.mongodb.net/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// get notified if we connect successfully or if a connection error occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // cosole.log("we're connected!");
});

//compiling initial post schema into a Model
const postSchema = new mongoose.Schema({
  postName: String,
  postContent: String
});
const Post = mongoose.model("Post", postSchema);

//create initial post ducument
const homeStartingContent = new Post({
  postName: "Home",
  postContent: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});


//create initial post ducument
const aboutContent = new Post({
  postName: "About",
  postContent: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});


//create initial post ducument
const contactContent = new Post({
  postName: "Contact",
  postContent: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

const composeSchema = new mongoose.Schema({
  postName: String,
  postContent: String
});

const Compose = mongoose.model("Compose", composeSchema);

app.get("/", (req, res) => {
  Post.findOne({postName: "Home"}, (err, doc) => {
    if(!err){
      if (!doc) {
        homeStartingContent.save();
        res.redirect("/");
      } else {
        Compose.find({}, (err, arr) => {
          if (!err) {
            res.render('home', {content: doc.postContent,posts: arr});
          }else{console.log(err);}
        });
      }
    }else{console.log(err);}
  });
});

app.get("/about", (req, res) => {
  Post.findOne({postName: "About"}, (err, doc) => {
    if(!err){
      if (!doc) {
        aboutContent.save();
        res.redirect("/about");
      } else {
        res.render('about', {
          content: doc.postContent
        });
      }
    }else{
      console.log(err);
    }

  });
});

app.get("/contact", (req, res) => {
  Post.findOne({postName: "Contact"}, (err, doc) => {
    if(!err){
      if (!doc) {
        contactContent.save();
        res.redirect("/contact");}
      else {res.render('contact', {content: doc.postContent});}}
    else{console.log(err);}
  });
});

//compose page can visit by only url
//using this to add new articles
app.get("/compose", (req, res) => {
  res.render('compose');});

app.post("/compose", (req, res) => {
  const body = {
    postTitle: _.lowerCase([string = req.body.postTitle]),
    postBody: req.body.postBody};

  const composePost = new Compose({
    postName: body.postTitle,
    postContent: body.postBody});

  composePost.save();
  res.redirect("/");
});

//adding new articles by using rout parameters
app.get('/posts/:topic', (req, res) => {
    Compose.findOne({postName : req.params.topic}).then((doc) => {
      if(!doc) { //if doc not exist in db
        return res.status(404).send('doc not found');
      }
      res.render('post', { //doc  exist
        title: doc.postName,
        content: doc.postContent,
      });
    }).catch((e) => {//bad request
      res.status(400).send(e);
    });
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started ");
});

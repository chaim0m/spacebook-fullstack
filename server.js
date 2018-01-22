var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var Post = require('./models/postModel');
mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})


app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/posts", function(req, res) {
  Post.find().exec(function(err, data) {
    res.send(data);
  })
})
app.post('/posts', (req, res) => {
  var post = new Post({
    text: req.body.text,
    comments: []
  })
  post.save();
  res.send(post);
});
console.log("requesting new route - delete");
app.post('/posts/:postid/comments', (req, res) => {
  var comment = {
    user: req.body.user,
    text: req.body.text
  }
  Post.findByIdAndUpdate(req.params.postid, { $push: {comments: comment }},{new:true},function(err,data){
    res.send(data)
  })

});
app.delete('/posts/:postid', function(req, res) {
  Post.findByIdAndRemove(req.params.postid, function(err, data) {
    console.log("delete", data);

    if (err) throw err;

    res.send('Post Deleted')
  })
})
app.delete('/posts/:postid/comments/'+':commentid', function(req, res) {
  Post.findByIdAndRemove(req.params.commentid, function(err, comment) {
    console.log("delete", comment);

    if (err) throw err;

    res.send('comment deleted')
  })
})

// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});

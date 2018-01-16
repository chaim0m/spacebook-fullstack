var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  text: String,
  username: String,
})

var postSchema = new mongoose.Schema({
  text: String,
  username: String,
  comments: [commentSchema]
})

//design the two schema below and use sub docs
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection


var Post = mongoose.model('post', postSchema)

// var aPost = new Post({ username: "John", text: "My first post!!!" });
//
// aPost.comments.push({ username: "Bob", text: "Great Post!" });
//
// aPost.save(function(err, data) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.error(data);
//   }
// });

module.exports = Post

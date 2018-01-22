var SpacebookApp = function() {

  var posts = [];

  var $posts = $(".posts");

  fetch();

  function fetch() {
    $.ajax({
      method: "GET",
      url: "/posts",
      success: function(data) {
        posts = data;
        _renderPosts();
        // console.log(posts)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      // console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
      $.ajax({
        method: "POST",
        url: "/posts",
        data: {
          text: newPost
        },
        success: function() {
          // posts.push(data);
          fetch();
        },

        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    };
    // function addPic(file) {
    //     $.ajax({
    //       method: "POST",
    //       url: "/profile",
    //       data: file,
    //       cache: false,
    //       contentType: 'multipart/form-data',
    //       processData: false,
    //       success: function(data) {
    //           alert(data);
    //           // posts.push(data);
    //         fetch();
    //       },

          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
          }
        });
      };



  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function(postId) {
    $.ajax({
      method: "DELETE",
      url: "/posts/" + postId,
      success: function() {
        fetch()
      }
    })
  };


  var addComment = function(newComment, postId) {
    $.ajax({
      method: "POST",
      url: "/posts/"+postId+"/comments",
      data: newComment,
      success: function() {
        // posts.postId.comments.push(data);
        fetch();
      },

      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  //   posts[postIndex].comments.push(newComment);
  //   _renderComments(postIndex);
  // };


  var deleteComment = function(postId, commentId) {
    $.ajax({
      method: "DELETE",
      url: "/posts/"+postId+"/comments/"+commentId,
      success: function() {
        fetch();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });




    // posts[postIndex].comments.splice(commentIndex, 1);
    // _renderComments(postIndex);
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    fetch: fetch,
    // addPic:addPic
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function() {
  var $input = $("#postText");
  // var file = $("#pic").val()
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    // app.addPic(file);
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var postId = $(this).closest('.post').data().id;
  app.removePost(postId);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var postId = $(this).closest('.post').data().id;
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.addComment(newComment, postId);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postId = $(this).closest('.post').index();
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();
  var commentId = $(this).closest('.comment').data().id;

  app.deleteComment(postId, commentId);
});

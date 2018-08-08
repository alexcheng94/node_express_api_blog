const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.get_all_posts = (req, res, next) => {
  Post.find()
    .populate("author", "username")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        post: docs.map(doc => {
          return {
            _id: doc._id,
            title: doc.title,
            author: doc.author.username,
            content: doc.content,
            date: doc.date,
            request: {
              type: "GET DELETE PATCH",
              url: req.protocol + "://" + req.headers.host + "/posts/" + doc._id
            }
          };
        })
      };
      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        //200 indicates the request has succeeded, however there is no entry.
        res.status(200).json({
          message: "No entries found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.get_one_post = (req, res, next) => {
  const id = req.params.postId;
  Post.findById(id)
    .populate("author", "username")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          title: doc.title,
          author: doc.author.username,
          content: doc.content,
          date: doc.date,
          request: {
            type: "DELETE PATCH",
            url: req.protocol + "://" + req.headers.host + req.originalUrl
          }
        });
      } else {
        res.status(404).json({
          message: "Invalid postId, no matching entry found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

// exports.get_posts_by_user = (req, res, next) => {
//   const { userId } = req.params;
//   Post.find({ author: userId })
//     .populate("author")
//     .exec()
//     .then(docs => {
//       res.status(200).json({
//         count: docs.length,
//         posts: docs.map(doc => {
//           return {
//             _id: doc._id,
//             title: doc.title,
//             author: doc.author["username"],
//             content: doc.content,
//             date: doc.date
//           };
//         })
//       });
//     })
//     .catch(err => {
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// };

//============ protected routes ====================

exports.post_new_article = (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.userData.userId,
    content: req.body.content,
    date: new Date().toISOString()
  });
  post
    .save()
    .then(result => {
      User.findById(req.userData.userId)
        .populate("posts")
        .then(doc => {
          doc.posts.push(result);
          doc.save();
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
      res.status(201).json({
        message: "Post successfully created",
        createdPost: {
          _id: result._id,
          title: result.title,
          author: result.author,
          content: result.content,
          date: result.date
        },
        request: {
          type: "GET DELETE PATCH",
          url: req.protocol + "://" + req.headers.host + "/posts/" + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.update_post = (req, res, next) => {
  const { postId } = req.params;
  const currentUser = req.userData;
  Post.findById(postId)
    .exec()
    .then(doc => {
      if (doc.author == currentUser.userId) {
        // Check which part(s) does user want to update
        const updateOps = {};
        for (const ops of req.body) {
          updateOps[ops.propName] = ops.value;
        }
        doc
          .update({ $set: updateOps })
          .exec()
          .then(result => {
            res.status(200).json({
              message: "update SUCCESSFUL",
              request: {
                type: "GET DELETE",
                url: req.protocol + "://" + req.headers.host + req.originalUrl
              }
            });
          })
          .catch(err=>{
            res.status(500).json({
              error: err
            })
          });
      } else {
        res.status(401).json({
          message: "Unauthorized. This is not your post"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delete_post = (req, res, next) => {
  const { postId } = req.params;
  const currentUser = req.userData;
  Post.findById(postId)
    .exec()
    .then(doc => {
      if (doc.author == currentUser.userId) {
        doc.remove().then(result => {
          res.status(200).json({
            message: "Entry successfully deleted"
          });
        })
        .catch(err=>{
          res.status(500).json({
            error: err
          })
        });
      } else {
        res.status(401).json({
          message: "Unauthorized. This is not your post"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

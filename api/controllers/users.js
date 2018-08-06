const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const keys = require("../../config/keys");
const User = require("../models/user");

//User signup route
exports.user_signup = (req, res, next) => {
  //Check if username already exists
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      //username exists, send 409 conflict code
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Username already exists"
        });
      } else {
        //username doesn't exist, proceed to hashing password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            //No errors hashing, create new user
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash
            });

            //save user to database and send "201 Created" success status response code
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User sign up successful!"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

//User login route
exports.user_login = (req, res) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      //cannot find a user with username from request
      if (user.length < 1) {
        //BAD! OPENS UP TO BRUTE FORCE ATTACKS
        // return res.status(404).json({
        //   messagae: "User not found"
        // })
        return res.status(401).json({
          message: "Auth failed"
        });
      } else {
        //found user, use bcrypt to compare password
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          //result returns ture if succeeded, false failed
          if (result) {
            //Sychronously generate jwt and assign it to variable "token"
            //See https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
            const token = jwt.sign(
              {
                username: user[0].username,
                userId: user[0]._id
              },
              keys.JWT_KEY,
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              message: "Auth successful",
              token
            });
          }
          return res.status(401).json({
            message: "Auth failed"
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//User delete route
exports.user_delete = (req, res, next) => {
  const currentUser = req.userData;
  const requestId = req.params.userId;

  if (currentUser.userId == requestId) {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        return res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  } else {
    res.status(401).json({
      message: "Unauthorized. You cannot delete other users"
    });
  }
};

//Get User Profile Route
//See http://mongoosejs.com/docs/populate.html (Populate)
exports.user_profile = (req,res,next)=>{
  User.findById(req.params.userId)
  .populate({
    path: 'posts'
  })
  .exec()
  .then(doc=>{
    if (doc) {
      res.status(200).json({
        _id: doc._id,
        username: doc.username,
        posts: doc.posts
      })
    }else{
      res.status(404).json({
        message: 'Cannot find such user'
      })
    }
  })
  .catch(err=>{
    res.status(500).json({
      error: err
    })
  })
}
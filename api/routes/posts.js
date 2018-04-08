const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Post = require("../models/post");
const postsController = require('../controllers/posts');

router.get("/", postsController.get_all_posts);

router.post("/", postsController.post_new_article);

router.get("/:postId", postsController.get_one_post);

router.patch("/:postId", postsController.update_post);

router.delete("/:postId", postsController.delete_post);

module.exports = router;

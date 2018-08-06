const express = require("express");
const router = express.Router();

const postsController = require('../controllers/posts');
const checkAuth = require('../middlewares/check-auth');

router.get("/", postsController.get_all_posts);

router.get("/:postId", postsController.get_one_post);

//Get a specific user's posts. Repetitive to users route's 'get_user_profile'
// router.get("/user/:userId", postsController.get_posts_by_user);

//============ protected routes ====================
router.post("/", checkAuth, postsController.post_new_article);

router.patch("/:postId", checkAuth, postsController.update_post);

router.delete("/:postId", checkAuth, postsController.delete_post);

module.exports = router;

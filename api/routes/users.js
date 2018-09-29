const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const checkAuth = require('../middlewares/check-auth');

//Get user profile
router.get('/:username', userController.user_profile)

//User signup route
router.post("/signup", userController.user_signup);

//User login route
router.post("/login", userController.user_login);

//user delete route
router.delete("/:userId", checkAuth, userController.user_delete);



module.exports = router;

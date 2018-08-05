const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");

//User signup route
router.post("/signup", userController.user_signup);

//User login route
router.post("/login", userController.user_login);

//user delete route
router.delete("/:userId", userController.user_delete);

module.exports = router;

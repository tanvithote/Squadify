const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { userSignupValidator } = require("../validators");
// const validator = require('../validators');

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// any rout containing: userID, our app will first execute userById()
router.param("userId", userById);

module.exports = router;
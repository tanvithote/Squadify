const express = require('express');
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost } = require('../controllers/post');
const { createPostValidators } = require('../validators');
const { userById } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.get('/posts', getPosts);
router.post(
    '/post/new/:userId', 
    requireSignin, 
    createPost,
    createPostValidators    
);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// any rout containing: userID, our app will first execute userById()
router.param("userId", userById);
// any rout containing: postID, our app will first execute postById()
router.param("postId", postById);

module.exports = router;

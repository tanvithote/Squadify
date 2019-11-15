const express = require("express");
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  singlePost,
  photo,
  like,
  unlike,
  comment,
  uncomment
} = require("../controllers/post");
const { createPostValidators } = require("../validators");
const { userById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/posts", getPosts);

// like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

// comments
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidators
);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.get("/post/:postId", singlePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);


// photo
router.get("/post/photo/:postId", photo);

// any rout containing: userID, our app will first execute userById()
router.param("userId", userById);
// any rout containing: postID, our app will first execute postById()
router.param("postId", postById);

module.exports = router;

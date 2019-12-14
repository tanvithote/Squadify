const express = require("express");

const {
  getGroups,
  getGroupsbyTags,
  createGroup,
  groupsByUser,
  groupsOfUser,
  groupById,
  isCreator,
  photo,
  singleGroup,
  deleteGroup,
  updateGroup,
  joinGroup,
  unjoinGroup,
  groupsByTagMidware,
  groupsByTag
} = require("../controllers/group");

// const { createPostValidators } = require('../validators');
const { userById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/groups", getGroups);
router.post("/group/new/:userId", requireSignin, createGroup);
router.get("/groups/by/:userId", requireSignin, groupsByUser);
router.get("/groups/tag/of/:userId", getGroupsbyTags);
router.get("/groups/of/:userId", requireSignin, groupsOfUser);
router.get("/group/:groupId", singleGroup);
router.put("/group/:groupId", requireSignin, isCreator, updateGroup);
router.put("/group/join/:groupId", requireSignin, joinGroup);
router.put("/group/unjoin/:groupId", requireSignin, unjoinGroup);
router.delete("/group/:groupId", requireSignin, isCreator, deleteGroup);
router.get("/groups/search/:tag", groupsByTag);

// photo
router.get("/group/photo/:groupId", photo);

// any rout containing: userID, our app will first execute userById()
router.param("userId", userById);
// any rout containing: groupID, our app will first execute groupById()
router.param("groupId", groupById);
router.param("tag", groupsByTagMidware);

module.exports = router;

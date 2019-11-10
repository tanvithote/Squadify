const express = require('express');
const { getGroups, createGroup, groupsByUser, groupById, isCreator, deleteGroup, updateGroup, joinGroup } = require('../controllers/group');
// const { createPostValidators } = require('../validators');
const { userById } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.get('/groups', getGroups);
router.post(
    '/group/new/:userId', 
    requireSignin, 
    createGroup   
);
router.get('/groups/by/:userId', requireSignin, groupsByUser);
router.put('/group/:groupId', requireSignin, isCreator, updateGroup);
router.put('/group/join/:groupId', requireSignin, joinGroup);
router.delete('/group/:groupId', requireSignin, isCreator, deleteGroup);

// any rout containing: userID, our app will first execute userById()
router.param("userId", userById);
// any rout containing: groupID, our app will first execute groupById()
router.param("groupId", groupById);

module.exports = router;

const express = require('express');
const { getEvents,getEvent, createEvent, eventsByGroup, eventById, isCreator, deleteEvent, updateEvent, attendEvent,notAttendEventGroup ,photo} = require('../controllers/event');
// const { createPostValidators } = require('../validators');
const { userById } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');
const { groupById } = require('../controllers/group');
const router = express.Router();

router.get('/events', getEvents);
router.post('/event/new/:userId/:groupId',requireSignin,createEvent);
router.get('/event/:eventId',requireSignin, getEvent);
router.get('/events/by/:groupId', requireSignin, eventsByGroup);
router.put('/event/:eventId', requireSignin, isCreator, updateEvent);
router.put('/event/attend/:eventId', requireSignin, attendEvent);
router.delete('/event/:eventId', requireSignin, isCreator, deleteEvent);
router.put('/event/notAttend/:eventId', requireSignin, notAttendEventGroup);

//photo
router.get("/event/photo/:eventId", photo);
// any rout containing: userID, our app will first execute userById()
router.param("userId", userById);
// any rout containing: groupID, our app will first execute groupById()
router.param("groupId", groupById);
// any rout containing: eventID, our app will first execute groupById()
router.param("eventId", eventById);


module.exports = router;

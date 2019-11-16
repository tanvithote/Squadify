const Event = require("../models/event");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const User = require("../models/user");
const Group = require("../models/group")

exports.eventById = (req, res, next, id) => {
  Event.findById(id)
    .populate("createdBy", "_id name")
    .exec((err, event) => {
      if (err || !event) {
        return res.status(400).json({
          error: err
        });
      }
      req.event = event;
      next();
    });
};

exports.getEvent = (req, res)=> {
  return res.json(req.event);
  };

exports.getEvents = (req, res) => {
  const events = Events.find()
    .populate("group","_id name")
    .select("_id name location")
    .then(events => {
      res.json({ events: events });
    })
    .catch(err => console.log(err));
};

exports.createEvent = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    let event = new Event(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    event.createdBy = req.profile;
    event.group = req.group;
    if (files.photo) {
      event.photo.data = fs.readFileSync(files.photo.path);
      event.photo.contentType = files.photo.type;
    }
    event.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
  const event = new Event(req.body);
  event.save().then(result => {
    res.status(200).json({
      event: result
    });
  });
};

exports.eventsByGroup = (req, res) => {
  Event.find({ group: req.group._id })
    .populate("group", "_id name")
    .sort("_created")
    .exec((err, events) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(events);
    });
};

exports.isCreator = (req, res, next) => {
  let isCreator =
    req.event && req.auth && req.event.createdBy._id == req.auth._id;
    console.log(req.event.createdBy._id);
    console.log(req.auth._id);

  if (!isCreator) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }
  next();
};

exports.updateEvent = (req, res, next) => {
  let event = req.event;
  event = _.extend(event, req.body);
  event.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json(event);
  });
};

exports.deleteEvent = (req, res) => {
  let event = req.event;
  event.remove((err, event) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Event deleted succesfully"
    });
  });
};

exports.attendEvent = (req, res, next) => {
  let event = req.event;
  event.attendes.push(req.auth._id);
  let user_find = null;
  User.findById(req.auth._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found."
      });
    }
    user_find = user;
    user.event.push(event._id); // adds profile object in req with user info
    user.save(err => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
    });
  });
  event.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      Event: event,
      user: user_find
    });
  });
//   next();
};

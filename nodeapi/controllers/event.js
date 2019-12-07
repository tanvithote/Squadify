const Event = require("../models/event");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const User = require("../models/user");
const Group = require("../models/group");

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

exports.getEvent = (req, res) => {
  return res.json(req.event);
};

exports.getEvents = (req, res) => {
  const events = Event.find()
    .then(events => {
      res.json({ events: events });
    })
    .catch(err => console.log(err));
};

// exports.createEvent = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Image could not be uploaded"
//       });
//     }
//     let event = new Event(fields);
//     req.profile.hashed_password = undefined;
//     req.profile.salt = undefined;

//     event.createdBy = req.profile;
//     event.group = req.group;
//     if (files.photo) {
//       event.photo.data = fs.readFileSync(files.photo.path);
//       event.photo.contentType = files.photo.type;
//     }
//     event.save((err, result) => {
//       if (err) {
//         return res.status(400).json({
//           error: err
//         });
//       }
//       res.json(result);
//     });
//   });
//   const event = new Event(req.body);
//   event.save().then(result => {
//     res.status(200).json({
//       event: result
//     });
//   });
// };

exports.createEvent = (req, res) => {
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
    event.attendes = req.profile._id;
    if (files.photo) {
      event.photo.data = fs.readFileSync(files.photo.path);
      event.photo.contentType = files.photo.type;
    }

    // Push this event to corresponding group
    Group.findByIdAndUpdate(
      req.group._id,
      { $push: { events: event._id } },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      } else {
        console.log(`Event ${event._id} pushed to its group`);
      }
    });

    event.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
};

exports.eventsByGroup = (req, res) => {
  console.log("in method");
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

exports.eventsByUser = (req, res) => {
  Event.find({ attendes: req.profile._id })
    // .populate("group", "_id name")
    // .sort("_created")
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
  let groupId = req.event.group;
  event.remove((err, event) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
  });

  Group.findByIdAndUpdate(
    groupId,
    { $pull: { events: req.event._id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      res.json({
        message: "Event Successfully deleted"
      });
    }
  });
};

exports.attendEvent = (req, res) => {
  console.log(req.event._id);
  console.log(req.auth._id);

  let event_Data = null;
  Event.findByIdAndUpdate(
    req.event._id,
    { $addToSet: { attendes: req.auth._id } },
    { new: true } // required by Mongoose
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      event_Data = result;
    }
  });

  User.findByIdAndUpdate(
    req.auth._id,
    { $addToSet: { events: req.event._id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      res.json({
        event: event_Data,
        user: result
      });
    }
  });
};

exports.notAttendEventGroup = (req, res) => {
  console.log(req.event._id);
  console.log(req.auth._id);
  let event_Data = null;
  Event.findByIdAndUpdate(
    req.event._id,
    { $pull: { attendes: req.body.userId } },
    { new: true } // required by Mongoose
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      event_Data = result;
    }
  });

  User.findByIdAndUpdate(
    req.auth._id,
    { $pull: { events: req.event._id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      res.json({
        event: event_Data,
        user: result
      });
      console.log(event_Data, result);
    }
  });
};
exports.photo = (req, res, next) => {
  res.set("Content-Type", req.event.photo.contentType);
  return res.send(req.event.photo.data);
};

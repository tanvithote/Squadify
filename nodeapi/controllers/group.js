const Group = require("../models/group");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const User = require("../models/user");

exports.groupById = (req, res, next, id) => {
  Group.findById(id)
    .populate("createdBy", "_id name")
    .exec((err, group) => {
      if (err || !group) {
        return res.status(400).json({
          error: err
        });
      }
      req.group = group;
      next();
    });
};

exports.getGroups = (req, res) => {
  const groups = Group.find()
    .populate("createdBy", "_id name")
    .select("_id name location")
    .then(groups => {
      res.json({ groups: groups });
    })
    .catch(err => console.log(err));
};

exports.createGroup = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    let group = new Group(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    group.createdBy = req.profile;
    if (files.photo) {
      group.photo.data = fs.readFileSync(files.photo.path);
      group.photo.contentType = files.photo.type;
    }
    group.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
  const group = new Group(req.body);
  group.save().then(result => {
    res.status(200).json({
      group: result
    });
  });
};

exports.groupsByUser = (req, res) => {
  Group.find({ createdBy: req.profile._id })
    .populate("createdBy", "_id name")
    .sort("_created")
    .exec((err, groups) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(groups);
    });
};

exports.isCreator = (req, res, next) => {
  let isCreator =
    req.group && req.auth && req.group.createdBy._id == req.auth._id;
  if (!isCreator) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }
  next();
};

exports.updateGroup = (req, res, next) => {
  let group = req.group;
  group = _.extend(group, req.body);
  group.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json(group);
  });
};

exports.deleteGroup = (req, res) => {
  let group = req.group;
  group.remove((err, group) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Group deleted succesfully"
    });
  });
};

exports.joinGroup = (req, res, next) => {
  let group = req.group;
  group.members.push(req.auth._id);
  let user_find = null;
  User.findById(req.auth._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found."
      });
    }
    user_find = user;
    user.groups.push(group._id); // adds profile object in req with user info
    user.save(err => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
    });
  });
  group.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      group: group,
      user: user_find
    });
  });
//   next();
};

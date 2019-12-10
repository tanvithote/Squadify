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
    // .select("_id name location about tags")
    .sort({ created: -1 })
    .then(groups => {
      res.json(groups);
    })
    .catch(err => console.log(err));
};

function putGroup(tag,grpList){

}


exports.getGroupsbyTags = (req, res) => {
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.body.email));
  const tagList = [];
  user  = User.find().
          where('email').equals(req.body.email).
          select('tags').exec(function (err, tags) {
            if (err) return handleError(err);
            console.log("TagList:");
            tagList.push(tags[0].tags);
            console.log(tagList)
            const groupList = [];
            //console.log(tags[0].tags);
            for(var i = 0; i < tags[0].tags.length; i++){
              //putGroup(tagList[0][i],groupList);
              Group.find({ tags: tags[0].tags[i].toLowerCase() })
              .populate("createdBy", "_id name")
              .exec(function (err, grps){
                  console.log(grps);
                  res.json(grps);
              });
            }
            console.log("GroupList");
            console.log(groupList);
          });
  
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
    if (group.tags) {
      group.tags = group.tags[0].toLowerCase().split(", ");
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

exports.photo = (req, res, next) => {
  res.set("Content-Type", req.group.photo.contentType);
  return res.send(req.group.photo.data);
};

// Groups created by user
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

// Groups joined by user
exports.groupsOfUser = (req, res) => {
    Group.find({ members: req.profile._id })
      .select("_id name")
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
    req.group && req.auth && req.group.createdBy._id == req.auth._id;
  if (!isCreator) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }
  next();
};

exports.updateGroup = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded."
      });
    }
    let group = req.group;
    // Override group with new fields
    group = _.extend(group, fields);
    if (files.photo) {
      group.photo.data = fs.readFileSync(files.photo.path);
      group.photo.contentType = files.photo.type;
    }

    group.save((err, reuslt) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      return res.json(group);
    });
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

exports.singleGroup = (req, res) => {
  return res.json(req.group);
};

// exports.joinGroup = (req, res, next) => {
//   let group = req.group;
//   group.members.push(req.auth._id);
//   let user_find = null;
//   User.findById(req.auth._id).exec((err, user) => {
//     if (err || !user) {
//       return res.status(400).json({
//         error: "User not found."
//       });
//     }
//     user_find = user;
//     user.groups.push(group._id); // adds profile object in req with user info
//     user.save(err => {
//       if (err) {
//         return res.status(400).json({
//           error: err
//         });
//       }
//     });
//   });
//   group.save(err => {
//     if (err) {
//       return res.status(400).json({
//         error: err
//       });
//     }
//     res.json({
//       group: group,
//       user: user_find
//     });
//   });
// //   next();
// };

exports.joinGroup = (req, res) => {
  Group.findByIdAndUpdate(
    req.body.groupId,
    { $push: { members: req.body.userId } },
    { new: true } // required by Mongoose
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      res.json(result);
    }
  });
};

exports.unjoinGroup = (req, res) => {
  Group.findByIdAndUpdate(
    req.body.groupId,
    { $pull: { members: req.body.userId } },
    { new: true } // required by Mongoose
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    } else {
      res.json(result);
    }
  });
};

// exports.groupsByTag = (req, res, next, tag) => {
//   let tag = req.tag;
//   console.log(tag);
//   Group.find({ tags: tag })
//     .populate("createdBy", "_id name")
//     .populate("members", "_id name")
//     .sort("_created")
//     // .select("_id name location created tags about photo")
//     .exec((err, groups) => {
//       if (err || !groups) {
//         return res.status(400).json({
//           error: err
//         });
//       }
//       res.json(groups);
//       // next();
//     });
// };

exports.groupsByTagMidware = (req, res, next, tag) => {
  console.log(tag);
  Group.find({ tags: tag.toLowerCase() }) // Group.find({name: "cooking"})
    .populate("createdBy", "_id name")
    .populate("members", "_id name")
    .sort("_created")
    // .select("_id name location created tags about photo")
    .exec((err, groups) => {
      if (err || !groups) {
        return res.status(400).json({
          error: err
        });
      }
      req.groups = groups;
      next();
    });
};

exports.groupsByTag = (req, res) => {
  res.json(req.groups);
};

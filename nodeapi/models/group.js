const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now()
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  location: {
    type: String,
    trim: true,
    required: true
  },
  about: {
    type: String,
    trim: true
  },
  members: {
      type: [ObjectId],
      ref: "User"
  },
  tags: [String],
  posts: [{ type: ObjectId, ref: "Post" }]
});

// methods
groupSchema.methods = {};

module.exports = mongoose.model("Group", groupSchema);

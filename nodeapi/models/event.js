const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const { ObjectId } = mongoose.Schema;

const eventSchema = new mongoose.Schema({
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
  eventdate:{
      type: Date
  },
  starttime: {
    type: Date
  },
  endtime:{
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  attendes: {
      type: [ObjectId],
      ref: "User"
  },
  tags: [String],
  group: {
    type: ObjectId,
    ref: "Group"
  }
});

// methods
eventSchema.methods = {};

module.exports = mongoose.model("Event", eventSchema);

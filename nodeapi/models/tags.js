const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const tagSchema = new mongoose.Schema({
    tagID: {
        type: String,
        trim: true,
        required: true
    },
    tagName: {
        type: String,
        trim: true,
        required: true
    }
});

tagSchema.methods = {};
module.exports = mongoose.model("tags", tagSchema);
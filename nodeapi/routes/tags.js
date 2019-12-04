const express = require("express");

const {getTags, putTags}= require("../controllers/tags");
const router = express.Router();

router.get("/getTags", getTags);
router.put("/putTags", putTags);

module.exports = router;

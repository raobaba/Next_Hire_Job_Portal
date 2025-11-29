const express = require("express");
const { getExternalJobs } = require("../controllers/externalJob.controller");

const router = express.Router();

router.route("/").get(getExternalJobs);

module.exports = router;


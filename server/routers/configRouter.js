const express = require("express");
const router = express.Router();
const {
  getConfigs,
  getConfigByKey,
  updateConfig,
  deleteConfig,
} = require("../controllers/configController");

router.route("/").get(getConfigs);
router.route("/:key").get(getConfigByKey).put(updateConfig).delete(deleteConfig);

module.exports = router;

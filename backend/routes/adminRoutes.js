const express = require("express");
const router = express.Router();

const { getAdminUserSummary, getUserStats } = require("../controllers/adminController");
const { getStrugglingUsers } = require("../controllers/adminStrugglingController");

router.get("/struggling-users", getStrugglingUsers);

router.get("/:userId/summary", getAdminUserSummary);
router.get("/:userId/analytics", getUserStats);

module.exports = router;
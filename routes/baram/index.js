const express = require("express");
const router = express.Router();
const notices = require("../../data/baram/notices");
const updates = require("../../data/baram/updates");
const events = require("../../data/baram/events");

router.get("/", (req, res) => {
  const latestNotices = notices.getAll().slice(0, 4);
  const latestUpdates = updates.getAll().slice(0, 3);
  const latestEvents = events.getAll().slice(0, 4).map((e) => ({
    ...e,
    status: events.getStatus(e),
  }));
  res.render("baram/index", { latestNotices, latestUpdates, latestEvents, user: req.session.user || null });
});

module.exports = router;

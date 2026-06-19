const express = require("express");
const router = express.Router();
const events = require("../../data/baram/events");
const { requireAdmin } = require("../../middleware/auth");

router.get("/", (req, res) => {
  const allEvents = events.getAll().map((e) => ({ ...e, status: events.getStatus(e) }));
  const active   = allEvents.filter((e) => e.status === "진행중");
  const upcoming = allEvents.filter((e) => e.status === "예정");
  const ended    = allEvents.filter((e) => e.status === "종료");
  res.render("baram/event", { active, upcoming, ended, user: req.session.user || null });
});

router.get("/write", requireAdmin, (req, res) => {
  res.render("baram/event-write", { user: req.session.user, error: null });
});

router.post("/write", requireAdmin, (req, res) => {
  const { title, description, startAt, endAt, category } = req.body;
  if (!title || !description || !startAt || !endAt) {
    return res.render("baram/event-write", { user: req.session.user, error: "모든 항목을 입력해주세요." });
  }
  events.create({ title, description, startAt, endAt, category });
  res.redirect("/baram/event");
});

module.exports = router;

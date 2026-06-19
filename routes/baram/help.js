const express = require("express");
const router = express.Router();

const inquiries = [];
let nextId = 1;

router.get("/", (req, res) => {
  res.render("baram/help", { user: req.session.user || null, success: false });
});

router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;
  inquiries.push({ id: nextId++, name, email, subject, message, createdAt: new Date() });
  res.render("baram/help", { user: req.session.user || null, success: true });
});

module.exports = router;

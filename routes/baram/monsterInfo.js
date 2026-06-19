const express = require("express");
const router = express.Router();
const monsters = require("../../data/baram/monsters");

const PAGE_SIZE = 20;

router.get("/", (req, res) => {
  const q = req.query.q || "";
  const all = monsters.search(q);

  const totalPages = Math.ceil(all.length / PAGE_SIZE) || 1;
  const current = Math.max(1, Math.min(parseInt(req.query.page) || 1, totalPages));
  const rows = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  res.render("baram/monster-info", {
    title: "몬스터 정보",
    q,
    rows,
    matched: all.length,
    current,
    totalPages,
    baseQuery: q ? `q=${encodeURIComponent(q)}&` : "",
    fmt: monsters.fmt,
    total: monsters.getAll().length,
    user: req.session.user || null,
  });
});

module.exports = router;

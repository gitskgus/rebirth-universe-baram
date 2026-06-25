const express = require("express");
const router = express.Router();
const combinations = require("../../data/baram/combinations");

const PAGE_SIZE = 20;

router.get("/", (req, res) => {
  const cat = req.query.cat || "전체";
  const q = req.query.q || "";
  const all = combinations.search(q, cat);

  const totalPages = Math.ceil(all.length / PAGE_SIZE) || 1;
  const current = Math.max(1, Math.min(parseInt(req.query.page) || 1, totalPages));
  const rows = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  res.render("baram/item-combination", {
    title: "아이템 조합",
    cat,
    q,
    rows,
    matched: all.length,
    total: combinations.getAll().length,
    current,
    totalPages,
    baseQuery: `cat=${encodeURIComponent(cat)}&` + (q ? `q=${encodeURIComponent(q)}&` : ""),
    categories: combinations.CATEGORIES,
    catColors: combinations.CATEGORY_COLORS,
    user: req.session.user || null,
  });
});

module.exports = router;

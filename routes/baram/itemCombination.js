const express = require("express");
const router = express.Router();
const combinations = require("../../data/baram/combinations");

const PAGE_SIZE = 12;

router.get("/", (req, res) => {
  const cat = req.query.cat || "전체";
  const all = cat === "전체" ? combinations.getAll() : combinations.getByCategory(cat);

  const totalPages = Math.ceil(all.length / PAGE_SIZE) || 1;
  const current = Math.max(1, Math.min(parseInt(req.query.page) || 1, totalPages));
  const rows = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  res.render("baram/item-combination", {
    title: "아이템 조합",
    cat,
    rows,
    total: all.length,
    current,
    totalPages,
    baseQuery: `cat=${encodeURIComponent(cat)}&`,
    categories: combinations.CATEGORIES,
    catColors: combinations.CATEGORY_COLORS,
    user: req.session.user || null,
  });
});

module.exports = router;

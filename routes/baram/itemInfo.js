const express = require("express");
const router = express.Router();
const items = require("../../data/baram/items");

const PAGE_SIZE = 12;

router.get("/", (req, res) => {
  const cat = req.query.cat || items.CATEGORIES[0];
  const q = (req.query.q || "").trim();

  const catItems = items.getByCategory(cat);
  const all = q
    ? catItems.filter((it) => it.name.toLowerCase().includes(q.toLowerCase()))
    : catItems;

  const totalPages = Math.ceil(all.length / PAGE_SIZE) || 1;
  const current = Math.max(1, Math.min(parseInt(req.query.page) || 1, totalPages));
  const rows = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  res.render("baram/item-info", {
    title: "아이템 정보",
    cat,
    q,
    rows,
    total: catItems.length,
    matched: all.length,
    current,
    totalPages,
    baseQuery: `cat=${encodeURIComponent(cat)}&${q ? `q=${encodeURIComponent(q)}&` : ""}`,
    categories: items.CATEGORIES,
    catColors: items.CATEGORY_COLORS,
    user: req.session.user || null,
  });
});

module.exports = router;

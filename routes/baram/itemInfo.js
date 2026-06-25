const express = require("express");
const router = express.Router();
const items = require("../../data/baram/items");

router.get("/", (req, res) => {
  const cat = req.query.cat || "전체";
  const q = (req.query.q || "").trim();

  const catItems = cat === "전체" ? items.getAll() : items.getByCategory(cat);
  const rows = q
    ? catItems.filter((it) => it.name.toLowerCase().includes(q.toLowerCase()))
    : catItems;

  res.render("baram/item-info", {
    title: "아이템 정보",
    cat,
    q,
    rows,
    total: items.getAll().length,
    matched: rows.length,
    categories: items.CATEGORIES,
    catColors: items.CATEGORY_COLORS,
    user: req.session.user || null,
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const combinations = require("../../data/baram/combinations");

router.get("/", (req, res) => {
  const cat = req.query.cat || "전체";
  const q = req.query.q || "";
  const rows = combinations.search(q, cat);

  res.render("baram/item-combination", {
    title: "아이템 조합",
    cat,
    q,
    rows,
    matched: rows.length,
    total: combinations.getAll().length,
    categories: combinations.CATEGORIES,
    catColors: combinations.CATEGORY_COLORS,
    user: req.session.user || null,
  });
});

module.exports = router;

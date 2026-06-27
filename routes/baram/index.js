const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

router.get("/", async (req, res) => {
  let rankingHighlights = null;
  try {
    const results = await Promise.all(rankings.JOB_CODES.map((code) => rankings.getByJob(code)));
    let overallTop = null;
    const byJob = {};
    rankings.JOB_CODES.forEach((code, i) => {
      const top = results[i][0]; // 이미 rank 오름차순이라 첫 번째가 1위
      if (top) byJob[code] = top.player_name;
      results[i].forEach((r) => {
        if (!overallTop || r.total_stat > overallTop.total_stat) overallTop = r;
      });
    });
    rankingHighlights = { overall: overallTop ? overallTop.player_name : null, byJob };
  } catch (err) {
    console.error("랭킹 하이라이트 조회 실패:", err.message);
  }

  res.render("baram/index", {
    rankingHighlights,
    jobCodes: rankings.JOB_CODES,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    user: req.session.user || null,
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

router.get("/", async (req, res) => {
  let rankingHighlights = null;
  try {
    const players = await rankings.getPlayers();
    const byJobAll = rankings.rankByJob(players);
    const byJob = {};
    rankings.JOB_CODES.forEach((code) => {
      const top = byJobAll[code][0];
      if (top) byJob[code] = top.player_name;
    });
    const overallTop = rankings.rankOverall(players)[0];
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

const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

router.get("/", async (req, res) => {
  const byJob = {};
  let error = null;
  try {
    const results = await Promise.all(rankings.JOB_CODES.map((code) => rankings.getByJob(code)));
    rankings.JOB_CODES.forEach((code, i) => {
      byJob[code] = results[i].map((r) => ({
        rank: r.rank,
        name: r.player_name,
        promote: rankings.PROMOTE_LABEL[r.promote_level] || "",
        level: r.level,
      }));
    });
  } catch (err) {
    console.error("랭킹 조회 실패:", err.message);
    error = "랭킹 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  res.render("baram/rankings", {
    title: "랭킹",
    jobCodes: rankings.JOB_CODES,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    byJob,
    error,
    user: req.session.user || null,
  });
});

module.exports = router;

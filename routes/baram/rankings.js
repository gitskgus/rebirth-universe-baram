const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

router.get("/", async (req, res) => {
  const byJob = {};
  let updatedAt = null;
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
      results[i].forEach((r) => {
        const t = new Date(r.updated_at).getTime();
        if (!isNaN(t) && (updatedAt === null || t > updatedAt)) updatedAt = t;
      });
    });
  } catch (err) {
    console.error("랭킹 조회 실패:", err.message);
    error = "랭킹 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  const updatedAtText = updatedAt
    ? new Date(updatedAt).toLocaleString("ko-KR", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
        timeZone: "Asia/Seoul",
      })
    : null;

  res.render("baram/rankings", {
    title: "랭킹",
    jobCodes: rankings.JOB_CODES,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    byJob,
    updatedAtText,
    error,
    user: req.session.user || null,
  });
});

module.exports = router;

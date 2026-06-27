const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

router.get("/", async (req, res) => {
  const tab = req.query.tab || "all"; // "all" | "1".."5"
  const q = (req.query.q || "").trim();

  let rows = [];
  let updatedAt = null;
  let error = null;

  const mapRow = (r, rank, job) => ({
    rank,
    name: r.player_name,
    job,
    promote: rankings.PROMOTE_LABEL[r.promote_level] || "",
    level: r.level,
  });

  try {
    const results = await Promise.all(rankings.JOB_CODES.map((code) => rankings.getByJob(code)));

    // 전체 랭킹 계산용 — 체마합(비공개 수치, 정렬 전용) 내림차순으로 5개 직업 통합
    const combined = [];
    results.forEach((data, i) => {
      const code = rankings.JOB_CODES[i];
      data.forEach((r) => {
        combined.push({ ...r, job: code });
        const t = new Date(r.updated_at).getTime();
        if (!isNaN(t) && (updatedAt === null || t > updatedAt)) updatedAt = t;
      });
    });
    combined.sort((a, b) => b.total_stat - a.total_stat);

    const jobIdx = rankings.JOB_CODES.indexOf(Number(tab));
    if (tab === "all" || jobIdx === -1) {
      rows = combined.slice(0, 100).map((r, i) => mapRow(r, i + 1, r.job));
    } else {
      const code = rankings.JOB_CODES[jobIdx];
      rows = results[jobIdx].map((r) => mapRow(r, r.rank, code));
    }

    if (q) {
      const kw = q.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(kw));
    }
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
    tab,
    q,
    rows,
    jobCodes: rankings.JOB_CODES,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    updatedAtText,
    error,
    user: req.session.user || null,
  });
});

module.exports = router;

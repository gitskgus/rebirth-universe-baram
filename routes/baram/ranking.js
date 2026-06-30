const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

// 공통: 선수단 + 어제/역대1위 스냅샷을 모두 불러와 태그(👑🏆💪🔮)·등락까지 계산
async function loadRankingContext() {
  const yesterday = rankings.daysAgo(1);
  const [players, yesterdayRows, rank1Rows] = await Promise.all([
    rankings.getPlayers(),
    rankings.getRankHistoryByDate(yesterday),
    rankings.getRank1History(),
  ]);

  const byJob = rankings.rankByJob(players);
  const yesterdayMap = rankings.mapByUserId(yesterdayRows);
  rankings.JOB_CODES.forEach((j) => rankings.attachRankChange(byJob[j], yesterdayMap));

  const { streaks, latestDate } = rankings.computeStreaks(rank1Rows);
  const streakFresh = latestDate === yesterday;
  const hallOfFame = rankings.computeHallOfFame(rank1Rows);

  const hpChamp = rankings.findChampion(players, "max_hp");
  const mpChamp = rankings.findChampion(players, "max_mp");

  // 오늘의 급상승 랭커 — 모든 직업 통틀어 등락이 가장 큰(상승폭이 큰) 1명
  let riser = null;
  rankings.JOB_CODES.forEach((j) => {
    byJob[j].forEach((p) => {
      if (p._rankChange != null && (!riser || p._rankChange > riser._rankChange)) riser = p;
    });
  });

  return { players, byJob, streaks, streakFresh, hallOfFame, hpChamp, mpChamp, riser };
}

// 각 선수 행에 표시할 태그 부여
function attachTags(p, job, ctx) {
  const tags = [];
  if (p._rank === 1) {
    const key = `${job}|${p.user_id}`;
    const streak = ctx.streakFresh && ctx.streaks.has(key) ? ctx.streaks.get(key) + 1 : 1;
    tags.push({ icon: "👑", text: `${streak}일째 1위` });
  }
  const fame = ctx.hallOfFame[job];
  if (fame && fame.user_id === p.user_id) tags.push({ icon: "🏆", text: "명예의 전당" });
  if (ctx.hpChamp && ctx.hpChamp.user_id === p.user_id) tags.push({ icon: "💪", text: "체력왕" });
  if (ctx.mpChamp && ctx.mpChamp.user_id === p.user_id) tags.push({ icon: "🔮", text: "마력왕" });
  return tags;
}

function mapRow(p, job, ctx) {
  return {
    rank: p._rank,
    name: p.player_name,
    job,
    promote: rankings.PROMOTE_LABEL[p.promote_level] || "",
    level: p.level,
    guild: p.guild_name || "",
    score: rankings.formatScore(p.total_score),
    rankChange: p._rankChange,
    tags: attachTags(p, job, ctx),
  };
}

router.get("/", async (req, res) => {
  const tab = req.query.tab || "all";
  const q = (req.query.q || "").trim();

  let rows = [];
  let banner = null;
  let error = null;

  try {
    const ctx = await loadRankingContext();

    if (tab === "all") {
      // 전체 탭 — 직업 통합 점수 순. 연속1위·명예의전당은 직업별 개념이라 제외, 체력왕/마력왕만 표시.
      const overall = rankings.rankOverall(ctx.players).slice(0, 100);
      rows = overall.map((p) => ({
        rank: p._rank,
        name: p.player_name,
        job: p.job,
        promote: rankings.PROMOTE_LABEL[p.promote_level] || "",
        level: p.level,
        guild: p.guild_name || "",
        score: rankings.formatScore(p.total_score),
        tags: [
          ctx.hpChamp && ctx.hpChamp.user_id === p.user_id ? { icon: "💪", text: "체력왕" } : null,
          ctx.mpChamp && ctx.mpChamp.user_id === p.user_id ? { icon: "🔮", text: "마력왕" } : null,
        ].filter(Boolean),
      }));
    } else {
      const job = Number(tab);
      if (rankings.JOB_CODES.includes(job)) {
        rows = ctx.byJob[job].map((p) => mapRow(p, job, ctx));
      }
    }

    if (q) {
      const kw = q.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(kw));
    }

    if (ctx.riser) {
      banner = { name: ctx.riser.player_name, rise: ctx.riser._rankChange };
    }
  } catch (err) {
    console.error("랭킹 조회 실패:", err.message);
    error = "랭킹 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  res.render("baram/ranking", {
    title: "랭킹",
    tab, q, rows, banner, error,
    jobCodes: rankings.JOB_CODES,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    user: req.session.user || null,
  });
});

router.get("/total", async (req, res) => {
  let rows = [];
  let error = null;
  try {
    const players = await rankings.getPlayers();
    const sorted = rankings.rankOverall(players);
    rows = sorted.slice(0, 100).map((p) => ({
      rank: p._rank,
      name: p.player_name,
      job: p.job,
      promote: rankings.PROMOTE_LABEL[p.promote_level] || "",
      level: p.level,
      guild: p.guild_name || "",
      score: rankings.formatScore(p.total_score),
    }));
  } catch (err) {
    console.error("통합 랭킹 조회 실패:", err.message);
    error = "랭킹 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  res.render("baram/ranking-total", {
    title: "전체 통합 순위",
    rows, error,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    user: req.session.user || null,
  });
});

router.get("/growth", async (req, res) => {
  let rows = [];
  let error = null;
  try {
    const weekAgo = rankings.daysAgo(7);
    const [players, weekAgoRows] = await Promise.all([
      rankings.getPlayers(),
      rankings.getRankHistoryByDate(weekAgo),
    ]);
    const weekAgoMap = rankings.mapByUserId(weekAgoRows);
    const growth = rankings.computeGrowth(players, weekAgoMap);
    rows = growth.map((p, i) => ({
      rank: i + 1,
      name: p.player_name,
      job: p.job,
      growth: rankings.formatScore(p.growth),
    }));
  } catch (err) {
    console.error("성장 속도 랭킹 조회 실패:", err.message);
    error = "랭킹 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  res.render("baram/ranking-growth", {
    title: "성장 속도 랭킹",
    rows, error,
    jobNames: rankings.JOB_NAMES,
    jobMeta: jobs.meta,
    user: req.session.user || null,
  });
});

module.exports = router;

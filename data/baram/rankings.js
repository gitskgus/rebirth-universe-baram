// 바람의나라 랭킹 — Supabase REST API(player_stats_v2 / rank_history)에서 실시간 조회
const SUPABASE_BASE = process.env.SUPABASE_URL || "https://iuqwbtfypjoftecthjgk.supabase.co/rest/v1";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable__JXVS_1N1JVS7x9a2Oko4w_8F9lVHv1";

// 운영/테스트용 계정 — 모든 랭킹 집계에서 제외
const EXCLUDED_USER_ID = "20372100008819894";

const JOB_NAMES = { 1: "전사", 2: "도적", 3: "도사", 4: "주술사", 5: "궁사" };
const PROMOTE_LABEL = { 0: "", 1: "1차", 2: "2차", 3: "3차", 4: "4차" };
const JOB_CODES = [1, 2, 3, 4, 5];

async function fetchTable(table, query) {
  const res = await fetch(`${SUPABASE_BASE}/${table}?${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase 응답 오류 (${table} ${res.status})`);
  return res.json();
}

function isoDate(d) { return d.toISOString().slice(0, 10); }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return isoDate(d); }

const PLAYER_FIELDS = "user_id,player_name,job,promote_level,level,max_hp,max_mp,total_score,guild_name,updated_at";

// 선수단 전체 (운영 계정 제외)
function getPlayers() {
  return fetchTable("player_stats_v2", `user_id=neq.${EXCLUDED_USER_ID}&select=${PLAYER_FIELDS}`);
}

// 특정 날짜 스냅샷 전체
function getRankHistoryByDate(date) {
  return fetchTable("rank_history", `snapshot_date=eq.${date}&user_id=neq.${EXCLUDED_USER_ID}&select=user_id,player_name,job,rank,total_score,snapshot_date`);
}

// 역대 1위 스냅샷 전체 (연속 1위 일수 · 명예의 전당 계산용)
function getRank1History() {
  return fetchTable("rank_history", `rank=eq.1&user_id=neq.${EXCLUDED_USER_ID}&select=user_id,player_name,job,snapshot_date&order=snapshot_date.asc`);
}

// --- 순위 계산 ---

// 직업별 순위 — { [job]: [선수, ...] }, 각 선수에 _rank 부여
function rankByJob(players) {
  const byJob = {};
  JOB_CODES.forEach((j) => (byJob[j] = []));
  players.forEach((p) => { if (byJob[p.job]) byJob[p.job].push(p); });
  Object.keys(byJob).forEach((j) => {
    byJob[j].sort((a, b) => b.total_score - a.total_score);
    byJob[j].forEach((p, i) => { p._rank = i + 1; });
  });
  return byJob;
}

// 전 직업 통합 순위 — 정렬된 배열, 각 선수에 _rank 부여
function rankOverall(players) {
  const sorted = [...players].sort((a, b) => b.total_score - a.total_score);
  sorted.forEach((p, i) => { p._rank = i + 1; });
  return sorted;
}

// user_id -> 스냅샷 매핑
function mapByUserId(rows) {
  const map = new Map();
  rows.forEach((r) => map.set(r.user_id, r));
  return map;
}

// 전일 대비 등락 부여 — p._rankChange: 양수=상승, 음수=하락, null=신규
function attachRankChange(players, yesterdayMap) {
  players.forEach((p) => {
    const y = yesterdayMap.get(p.user_id);
    p._rankChange = y ? y.rank - p._rank : null;
  });
}

// 전 직업 통합 1위 (HP/MP 챔피언)
function findChampion(players, field) {
  if (!players.length) return null;
  return players.reduce((best, p) => (p[field] > best[field] ? p : best), players[0]);
}

// 주간 성장 속도 Top 20
function computeGrowth(players, weekAgoMap) {
  const out = [];
  players.forEach((p) => {
    const w = weekAgoMap.get(p.user_id);
    if (w && p.total_score > w.total_score) {
      out.push({ ...p, growth: Math.round(p.total_score - w.total_score) });
    }
  });
  out.sort((a, b) => b.growth - a.growth);
  return out.slice(0, 20);
}

// 직업별 연속 1위 일수 — rank_history에는 "어제까지"의 기록만 있으므로,
// 가장 최근 스냅샷 날짜를 기준으로 거꾸로 연속 일수를 센다.
// 반환: { streaks: Map(`job|user_id` -> 어제까지의 연속일수), latestDate }
function computeStreaks(rank1Rows) {
  const byKey = new Map();
  let latestDate = null;
  rank1Rows.forEach((r) => {
    const key = `${r.job}|${r.user_id}`;
    if (!byKey.has(key)) byKey.set(key, new Set());
    byKey.get(key).add(r.snapshot_date);
    if (!latestDate || r.snapshot_date > latestDate) latestDate = r.snapshot_date;
  });
  const streaks = new Map();
  byKey.forEach((dateSet, key) => {
    let streak = 0;
    let cursor = latestDate;
    while (cursor && dateSet.has(cursor)) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = isoDate(d);
    }
    if (streak > 0) streaks.set(key, streak);
  });
  return { streaks, latestDate };
}

// 직업별 명예의 전당(역대 최장 1위) — { [job]: { player_name, user_id, days } }
function computeHallOfFame(rank1Rows) {
  const counts = new Map(); // `job|user_id|player_name` -> count
  rank1Rows.forEach((r) => {
    const key = `${r.job}|${r.user_id}|${r.player_name}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const byJob = {};
  counts.forEach((days, key) => {
    const [job, user_id, player_name] = key.split("|");
    if (!byJob[job] || days > byJob[job].days) byJob[job] = { user_id, player_name, days };
  });
  return byJob;
}

// 점수 축약 표기 (26200000 -> "26.2M")
function formatScore(n) {
  if (n == null) return "-";
  const abs = Math.abs(n);
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}

module.exports = {
  JOB_NAMES, PROMOTE_LABEL, JOB_CODES, EXCLUDED_USER_ID,
  getPlayers, getRankHistoryByDate, getRank1History,
  rankByJob, rankOverall, mapByUserId, attachRankChange,
  findChampion, computeGrowth, computeStreaks, computeHallOfFame,
  formatScore, isoDate, daysAgo,
};

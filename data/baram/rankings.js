// 바람의나라 직업별 랭킹 — Supabase REST API(ranking_by_job)에서 실시간 조회
const SUPABASE_URL = process.env.SUPABASE_URL || "https://iuqwbtfypjoftecthjgk.supabase.co/rest/v1/ranking_by_job";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable__JXVS_1N1JVS7x9a2Oko4w_8F9lVHv1";

const JOB_NAMES = { 1: "전사", 2: "도적", 3: "도사", 4: "주술사", 5: "궁사" };
const PROMOTE_LABEL = { 0: "", 1: "1차", 2: "2차", 3: "3차", 4: "4차" };
const JOB_CODES = [1, 2, 3, 4, 5];

async function fetchRanking(query) {
  const res = await fetch(`${SUPABASE_URL}?${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase 응답 오류 (${res.status})`);
  return res.json();
}

module.exports = {
  JOB_NAMES,
  PROMOTE_LABEL,
  JOB_CODES,
  // 직업 내 랭킹 1~100위 (job=eq.N, rank 오름차순)
  getByJob: (job) => fetchRanking(`job=eq.${job}&order=rank.asc`),
};

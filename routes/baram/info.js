const express = require("express");
const router = express.Router();
const jobs = require("../../data/baram/jobs");

// 핵심 시스템 안내
const systems = [
  {
    icon: "📈",
    name: "환산 레벨",
    desc: "레벨과 경험치를 종합한 성장 지표입니다. 같은 레벨이라도 환산이 높을수록 더 많은 경험치를 쌓은 강자임을 의미하며, 랭킹의 기준이 됩니다.",
  },
  {
    icon: "🏅",
    name: "명성",
    desc: "사냥, 퀘스트, 문파 활동을 통해 쌓이는 명예 수치입니다. 명성이 높으면 특정 NPC 상점과 칭호, 전용 콘텐츠를 이용할 수 있습니다.",
  },
  {
    icon: "🏯",
    name: "문파 (길드)",
    desc: "레벨 30 이상이면 문파를 창설하거나 가입할 수 있습니다. 문파원과 함께 사냥하고, 매주 열리는 문파 패권 전쟁에서 영지를 두고 겨룹니다.",
  },
  {
    icon: "♻️",
    name: "환생 · 승급",
    desc: "최고 레벨에 도달하면 환생을 통해 더 강한 천인(天人)으로 승급할 수 있습니다. 환생 시 전용 스킬과 외형이 개방됩니다.",
  },
];

// 주요 지역
const regions = [
  { name: "국내성", level: "1 ~ 30", desc: "모험이 시작되는 고려의 수도. 초보 사냥터와 기본 NPC가 모여 있습니다." },
  { name: "부여성", level: "30 ~ 50", desc: "북방의 거대 성곽 도시. 중급 사냥터와 문파 관리소가 위치합니다." },
  { name: "백두산", level: "50 ~ 75", desc: "눈 덮인 영산. 강력한 설원 몬스터와 희귀 장비 드랍으로 유명합니다." },
  { name: "남만", level: "75 ~ 90", desc: "남쪽 변방의 정글 지대. 독과 맹수가 가득한 고난도 지역입니다." },
  { name: "현무도", level: "90+", desc: "전설의 사신 현무가 잠든 비경. 최상위 보스 레이드가 열립니다." },
];

router.get("/", (req, res) => {
  res.render("baram/info", {
    title: "게임정보",
    jobs: jobs.getAll(),
    systems,
    regions,
    user: req.session.user || null,
  });
});

module.exports = router;

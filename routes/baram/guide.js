const express = require("express");
const router = express.Router();

// 시작하기 단계
const steps = [
  { no: 1, icon: "bi-download", title: "게임 다운로드", desc: "공식 런처를 내려받아 설치합니다. Windows 7 이상에서 실행됩니다." },
  { no: 2, icon: "bi-person-plus", title: "회원가입", desc: "이메일로 간편하게 가입하고 계정을 생성하세요. 하나의 계정으로 모든 캐릭터를 관리합니다." },
  { no: 3, icon: "bi-person-badge", title: "캐릭터 생성", desc: "전사 · 도적 · 주술사 · 도사 중 원하는 직업을 선택해 캐릭터를 만듭니다." },
  { no: 4, icon: "bi-flag", title: "모험 시작", desc: "국내성에서 튜토리얼을 따라 첫 사냥을 떠나세요. 고려의 전설이 당신을 기다립니다." },
];

// 운영 정책
const policies = [
  { icon: "bi-shield-check", title: "공정한 플레이", desc: "버그 악용, 핵·매크로 사용은 영구 정지 대상입니다. 모두가 공정하게 즐길 수 있는 환경을 지향합니다." },
  { icon: "bi-chat-square-text", title: "건전한 채팅", desc: "욕설, 비방, 사기 행위는 제재됩니다. 신고 접수 시 운영팀이 신속히 검토합니다." },
  { icon: "bi-cash-coin", title: "현금 거래 금지", desc: "게임 내 재화·계정의 현금 거래(현거래)는 금지되며, 적발 시 계정이 회수됩니다." },
];

router.get("/", (req, res) => {
  res.render("baram/guide", {
    title: "안내",
    steps,
    policies,
    user: req.session.user || null,
  });
});

module.exports = router;

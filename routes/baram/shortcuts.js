const express = require("express");
const router = express.Router();

// 필수 단축키 (이동 포함)
const essentialKeys = [
  { keys: "방향키 (↑ ↓ ← →)", desc: "캐릭터 이동" },
  { keys: "R", desc: "탈것 타기 / 내리기" },
  { keys: "Space", desc: "기본 공격" },
  { keys: "I", desc: "소지품(인벤토리) 창 열기" },
  { keys: "K / +", desc: "스킬창 열기" },
  { keys: "Enter", desc: "채팅 입력창 열기" },
];

// 단축키 — 카테고리별
const shortcutGroups = [
  {
    title: "채팅 · 소통",
    icon: "bi-chat-dots-fill",
    items: [
      { keys: "Enter", desc: "일반 채팅 입력창 열기" },
      { keys: "Shift 를 누른 채 1", desc: "강조(굵은) 채팅 입력" },
      { keys: "Shift 를 누른 채 2", desc: "문파(길드) 채팅 입력" },
      { keys: "Shift 를 누른 채 3", desc: "그룹(파티) 채팅 입력" },
      { keys: "G / Shift 를 누른 채 '", desc: "귓속말 입력 (이어서 대상 이름 입력)" },
      { keys: "Shift 를 누른 채 Z", desc: "스킬 사용하기" },
      { keys: "Shift 를 누른 채 ; (세미콜론)", desc: "감정표현(이모트) 입력" },
    ],
  },
  {
    title: "전투 · 기본 행동",
    icon: "bi-lightning-fill",
    items: [
      { keys: "Space", desc: "기본 공격" },
      { keys: ", (쉼표)", desc: "앉기" },
      { keys: "Shift 를 누른 채 ,", desc: "빠르게 연속으로 앉기" },
      { keys: "1~9, 0", desc: "스킬 슬롯 1~10번 사용 (키패드 포함)" },
      { keys: "Tab", desc: "대상 지정(타겟팅) 모드 켜기/끄기" },
      { keys: "Tab → 방향키 → Enter", desc: "방향키로 대상을 고르고 Enter로 확정 (Esc는 취소)" },
    ],
  },
  {
    title: "창(UI) 열기·닫기",
    icon: "bi-window",
    items: [
      { keys: "I", desc: "소지품(인벤토리) 창" },
      { keys: "K / +", desc: "스킬창" },
      { keys: "S", desc: "캐릭터 상태창" },
      { keys: "F", desc: "파티(그룹) 상태창" },
      { keys: "PageDown", desc: "유저 상세정보창 (캐릭터 상태창이 열려있을 때)" },
      { keys: "F10", desc: "채팅 매크로 설정창" },
      { keys: "Shift 를 누른 채 I", desc: "조합(제작) 창" },
      { keys: "Shift 를 누른 채 E", desc: "소켓 추가 창" },
      { keys: "Shift 를 누른 채 Y", desc: "아이템 추가옵션 확인 창" },
    ],
  },
  {
    title: "아이템 조작",
    icon: "bi-box-seam",
    full: true,
    items: [
      { keys: "U → 슬롯 문자", desc: "아이템 사용 (U를 누른 뒤 사용할 슬롯의 문자를 입력)" },
      { keys: "D → 슬롯 문자", desc: "아이템 버리기 (D를 누른 뒤 버릴 슬롯의 문자를 입력, \\ 입력 시 금전 버리기로 전환)" },
      { keys: "Shift 를 누른 채 D", desc: "아이템 전체 버리기" },
      { keys: "C → 슬롯 문자 두 개", desc: "아이템 슬롯 위치 바꾸기 (예: ab 입력 시 a·b 슬롯 교환)" },
      { keys: "Shift 를 누른 채 C → 슬롯 문자 두 개", desc: "스킬 슬롯 위치 바꾸기" },
      { keys: "Shift 를 누른 채 T", desc: "장비 해제(탈의)" },
    ],
  },
];

router.get("/", (req, res) => {
  res.render("baram/shortcuts", {
    title: "단축키",
    essentialKeys,
    shortcutGroups,
    user: req.session.user || null,
  });
});

module.exports = router;

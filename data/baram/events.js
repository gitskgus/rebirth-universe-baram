const events = [
  {
    id: 1,
    title: "단오절 기념 축제",
    description: "고려의 단오절을 재현! 씨름 미니게임 참여 및 부적 수집으로 특별 보상을 획득하세요.",
    badge: "🎋",
    startAt: new Date("2026-05-26"),
    endAt: new Date("2026-06-05"),
    category: "시즌",
  },
  {
    id: 2,
    title: "백두산 설원 탐험 이벤트",
    description: "신규 지역 백두산 설원을 탐험하고 설산의 정기를 모아 전설 장비를 획득하세요.",
    badge: "🏔️",
    startAt: new Date("2026-05-15"),
    endAt: new Date("2026-06-15"),
    category: "신규",
  },
  {
    id: 3,
    title: "길드 패권 전쟁 시즌 3",
    description: "고려의 패권을 차지할 강호들이여, 집결하라! 상위 길드에게 왕실 문장 아이템을 지급합니다.",
    badge: "⚔️",
    startAt: new Date("2026-05-01"),
    endAt: new Date("2026-05-31"),
    category: "길드",
  },
  {
    id: 4,
    title: "연속 출석 보상 이벤트",
    description: "30일 연속 출석 달성 시 '천관의 비기' 특별 장비를 획득할 수 있습니다.",
    badge: "📜",
    startAt: new Date("2026-06-01"),
    endAt: new Date("2026-06-30"),
    category: "출석",
  },
];

let nextId = events.length + 1;

function getAll() {
  return [...events].sort((a, b) => b.startAt - a.startAt);
}

function getById(id) {
  return events.find((e) => e.id === parseInt(id));
}

function getStatus(event) {
  const now = new Date();
  if (now < event.startAt) return "예정";
  if (now > event.endAt) return "종료";
  return "진행중";
}

function create({ title, description, startAt, endAt, category }) {
  const event = {
    id: nextId++,
    title,
    description,
    badge: "🎉",
    startAt: new Date(startAt),
    endAt: new Date(endAt),
    category: category || "기타",
  };
  events.push(event);
  return event;
}

module.exports = { getAll, getById, getStatus, create };

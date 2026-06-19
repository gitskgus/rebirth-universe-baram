const updates = [
  {
    id: 1,
    title: "2026.05.15 패치노트 — 백두산 설원 1차 업데이트",
    content: `<h5>신규 콘텐츠</h5>
<ul>
<li>신규 지역 '백두산 설원' 1구역 오픈</li>
<li>신규 보스 '설산의 호랑이 신령' 추가</li>
<li>신규 장비 세트 '설원의 전사 갑옷' 추가 (총 4종)</li>
</ul>
<h5>밸런스 조정</h5>
<ul>
<li>무사 계열 공격력 8% 상향</li>
<li>도사 계열 기력 회복 속도 개선</li>
<li>일반 몬스터 경험치 5% 상향</li>
</ul>
<h5>버그 수정</h5>
<ul>
<li>특정 지역에서 이동 불가 버그 수정</li>
<li>거래 화면 표시 오류 수정</li>
</ul>`,
    author: "개발팀",
    views: 4521,
    createdAt: new Date("2026-05-15"),
  },
  {
    id: 2,
    title: "2026.05.01 패치노트 — 단오절 업데이트",
    content: `<h5>시즌 이벤트</h5>
<ul>
<li>단오절 기념 이벤트 맵 '한양 광장' 추가</li>
<li>씨름 미니게임 추가</li>
<li>단오 한복 코스튬 3종 추가</li>
</ul>
<h5>시스템 개선</h5>
<ul>
<li>파티 시스템 UI 개선</li>
<li>채팅 필터 개선</li>
</ul>`,
    author: "개발팀",
    views: 3892,
    createdAt: new Date("2026-05-01"),
  },
  {
    id: 3,
    title: "2026.04.10 패치노트 — 신규 직업 '천관' 추가",
    content: `<h5>신규 직업</h5>
<ul>
<li>신규 직업 '천관' 추가 — 하늘의 기운을 다루는 도인 계열 직업</li>
<li>전용 스킬 25종 추가</li>
<li>전용 장비 8종 추가</li>
</ul>
<h5>밸런스 패치</h5>
<ul>
<li>전 직업 PvP 밸런스 전반 조정</li>
</ul>`,
    author: "개발팀",
    views: 7234,
    createdAt: new Date("2026-04-10"),
  },
  {
    id: 4,
    title: "2026.03.01 패치노트 — 봄 축제 업데이트",
    content: `<h5>봄 시즌 콘텐츠</h5>
<ul>
<li>봄 테마 임시 맵 '매화 정원' 추가</li>
<li>계절 한정 코스튬 15종 추가</li>
<li>꽃잎 수집 이벤트 추가</li>
</ul>`,
    author: "개발팀",
    views: 3104,
    createdAt: new Date("2026-03-01"),
  },
  {
    id: 5,
    title: "2026.01.05 패치노트 — 새해 대업데이트",
    content: `<h5>신년 대업데이트</h5>
<ul>
<li>새해 기념 왕실 의례 이벤트 추가</li>
<li>신규 지역 '제주 한라산' 추가</li>
<li>길드 전쟁 시스템 전면 개편</li>
</ul>`,
    author: "개발팀",
    views: 9201,
    createdAt: new Date("2026-01-05"),
  },
];

let nextId = updates.length + 1;

function getAll() {
  return [...updates].sort((a, b) => b.createdAt - a.createdAt);
}

function getById(id) {
  return updates.find((u) => u.id === parseInt(id));
}

function create({ title, content, author }) {
  const update = {
    id: nextId++,
    title,
    content,
    author: author || "개발팀",
    views: 0,
    createdAt: new Date(),
  };
  updates.push(update);
  return update;
}

module.exports = { getAll, getById, create };

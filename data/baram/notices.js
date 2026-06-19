const notices = [
  {
    id: 1,
    title: "[필독] 놀자유니버스: 바람의나라 서비스 이용약관 안내",
    content: `<p>안녕하세요, 놀자유니버스: 바람의나라 운영팀입니다.</p>
<p>서비스 이용 전 반드시 읽어주시기 바랍니다.</p>
<h5>1. 계정 정책</h5>
<p>계정은 1인 1계정을 원칙으로 하며, 계정 공유 및 양도는 금지되어 있습니다.</p>
<h5>2. 게임 내 규칙</h5>
<p>버그 악용, 불법 프로그램 사용 시 영구 제재됩니다.</p>
<h5>3. 커뮤니티 규칙</h5>
<p>타 유저에 대한 비방, 욕설, 개인정보 노출은 금지됩니다.</p>`,
    author: "운영팀",
    isPinned: true,
    views: 3205,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    title: "[안내] 바람의나라 공식 커뮤니티 오픈",
    content: `<p>놀자유니버스: 바람의나라 공식 커뮤니티가 오픈되었습니다.</p>
<p>커뮤니티에서 동료 모험가들과 소통하고 다양한 정보를 나눠보세요!</p>`,
    author: "운영팀",
    isPinned: true,
    views: 2890,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: 3,
    title: "[점검] 5월 정기 서버 점검 안내 (05/21)",
    content: `<p>안녕하세요, 놀자유니버스: 바람의나라 운영팀입니다.</p>
<p>서버 안정화를 위한 정기 점검을 진행합니다.</p>
<p><strong>점검 일시:</strong> 2026년 5월 21일 (목) 오전 4:00 ~ 오전 8:00</p>
<p><strong>점검 내용:</strong> 신규 콘텐츠 패치 및 버그 수정</p>`,
    author: "운영팀",
    isPinned: false,
    views: 1543,
    createdAt: new Date("2026-05-15"),
  },
  {
    id: 4,
    title: "[이벤트] 단오절 기념 특별 이벤트",
    content: `<p>단오절을 맞아 고려 왕조의 축제를 재현한 특별 이벤트를 진행합니다!</p>
<p><strong>기간:</strong> 5월 26일 ~ 6월 5일</p>
<p><strong>내용:</strong> 단오 한복 코스튬 지급, 씨름 미니게임, 부적 수집 이벤트</p>`,
    author: "운영팀",
    isPinned: false,
    views: 2102,
    createdAt: new Date("2026-05-10"),
  },
  {
    id: 5,
    title: "[안내] 신규 지역 '백두산 설원' 오픈 예정",
    content: `<p>대규모 업데이트로 신규 지역 '백두산 설원'이 추가될 예정입니다.</p>
<p>자세한 일정은 추후 공지를 통해 안내드리겠습니다.</p>`,
    author: "운영팀",
    isPinned: false,
    views: 2876,
    createdAt: new Date("2026-04-25"),
  },
];

let nextId = notices.length + 1;

function getAll() {
  return [...notices].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
}

function getById(id) {
  return notices.find((n) => n.id === parseInt(id));
}

function create({ title, content, author, isPinned }) {
  const notice = {
    id: nextId++,
    title,
    content,
    author: author || "운영팀",
    isPinned: !!isPinned,
    views: 0,
    createdAt: new Date(),
  };
  notices.push(notice);
  return notice;
}

module.exports = { getAll, getById, create };

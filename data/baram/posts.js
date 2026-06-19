const posts = [
  {
    id: 1,
    title: "바람의나라 입문자를 위한 직업 추천 가이드",
    content: `<p>안녕하세요! 바람의나라를 시작하시는 분들을 위한 직업 가이드입니다.</p>
<h5>1. 무사</h5>
<p>근접 전투에 특화된 직업. 높은 방어력과 HP로 초보자에게 적합합니다.</p>
<h5>2. 도사</h5>
<p>원거리 주술 공격이 가능한 직업. 조작이 다소 어렵지만 강력한 광역기를 보유합니다.</p>
<h5>3. 천관 (신규)</h5>
<p>하늘의 기운을 다루는 직업. 독특한 플레이스타일로 인기를 끌고 있습니다.</p>`,
    author: "고려전사",
    views: 2341,
    likes: 134,
    comments: [
      { id: 1, author: "바람나그네", content: "무사로 시작했는데 맞는 말이에요!", createdAt: new Date("2026-05-12") },
      { id: 2, author: "청룡검사", content: "천관 설명도 추가해주세요!", createdAt: new Date("2026-05-13") },
    ],
    createdAt: new Date("2026-05-05"),
  },
  {
    id: 2,
    title: "백두산 설원 지도 & 몬스터 정보 공유",
    content: `<p>신규 지역 백두산 설원을 탐험해봤습니다!</p>
<p><strong>1구역 (빙설 평원):</strong> 권장 레벨 70+, 설야구미 출몰</p>
<p><strong>2구역 (얼음 동굴):</strong> 권장 레벨 85+, 빙령 정령 출몰</p>
<p><strong>보스 (설산의 호랑이 신령):</strong> 권장 레벨 95+, 파티 3인 이상 권장</p>`,
    author: "탐험가김씨",
    views: 3102,
    likes: 201,
    comments: [
      { id: 1, author: "고려전사", content: "고생하셨습니다. 정보 감사해요!", createdAt: new Date("2026-05-16") },
    ],
    createdAt: new Date("2026-05-16"),
  },
  {
    id: 3,
    title: "단오절 이벤트 씨름 미니게임 공략",
    content: `<p>단오절 이벤트의 씨름 미니게임 공략을 공유합니다.</p>
<p><strong>기본 조작:</strong> W/S로 힘 조절, A/D로 방향 전환</p>
<p><strong>핵심 팁:</strong> 상대방이 힘을 쏟을 때 반대 방향으로 당기면 쉽게 넘어뜨릴 수 있습니다.</p>
<p>하루 5회 참여 시 부적 10개를 획득할 수 있으니 꼭 참여하세요!</p>`,
    author: "씨름왕",
    views: 1892,
    likes: 97,
    comments: [],
    createdAt: new Date("2026-05-14"),
  },
  {
    id: 4,
    title: "길드 패권 전쟁 참가 모집합니다 [청룡단]",
    content: `<p>길드 패권 전쟁 시즌 3에 참가할 청룡단 길드원을 모집합니다!</p>
<p><strong>조건:</strong> 레벨 60 이상, 주 4회 이상 접속 가능</p>
<p><strong>혜택:</strong> 길드 공용 창고 이용 가능, 길드 전용 사냥터 입장권 제공</p>`,
    author: "청룡단주",
    views: 987,
    likes: 43,
    comments: [
      { id: 1, author: "바람나그네", content: "가입 신청합니다!", createdAt: new Date("2026-05-10") },
    ],
    createdAt: new Date("2026-05-08"),
  },
  {
    id: 5,
    title: "천관 직업 첫 인상 후기",
    content: `<p>신규 직업 천관을 레벨 40까지 키워봤습니다.</p>
<p>하늘의 기운을 사용하는 방식이 매우 독특합니다.</p>
<p><strong>장점:</strong> 독특한 기력 시스템, 화려한 스킬 이펙트, 보조 스킬이 파티에서 유용</p>
<p><strong>단점:</strong> 기력 관리가 복잡해서 초보자에겐 어려울 수 있음</p>`,
    author: "도인수련생",
    views: 1543,
    likes: 88,
    comments: [],
    createdAt: new Date("2026-04-12"),
  },
];

let nextPostId = 6;
let nextCommentId = 10;

function getAll() {
  return [...posts].sort((a, b) => b.createdAt - a.createdAt);
}

function getById(id) {
  return posts.find((p) => p.id === parseInt(id));
}

function create({ title, content, author }) {
  const post = {
    id: nextPostId++,
    title,
    content,
    author,
    views: 0,
    likes: 0,
    comments: [],
    createdAt: new Date(),
  };
  posts.push(post);
  return post;
}

function incrementViews(id) {
  const post = getById(id);
  if (post) post.views++;
}

function addComment(postId, { author, content }) {
  const post = getById(postId);
  if (!post) return null;
  const comment = { id: nextCommentId++, author, content, createdAt: new Date() };
  post.comments.push(comment);
  return comment;
}

module.exports = { getAll, getById, create, incrementViews, addComment };

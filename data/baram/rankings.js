// 바람의나라 랭킹 더미 데이터
// 환산(換算): 레벨·경험치를 종합한 성장 지표 — 정렬 기준
const characters = [
  { name: "천하무적", job: "전사", level: 99, hwansan: 412, fame: 9820, guild: "고려무신" },
  { name: "바람의검", job: "전사", level: 99, hwansan: 398, fame: 8740, guild: "백두문" },
  { name: "그림자칼날", job: "도적", level: 99, hwansan: 405, fame: 9120, guild: "고려무신" },
  { name: "오행지존", job: "주술사", level: 99, hwansan: 421, fame: 9990, guild: "천도문" },
  { name: "약손도사", job: "도사", level: 99, hwansan: 388, fame: 8650, guild: "천도문" },
  { name: "철벽무사", job: "전사", level: 98, hwansan: 372, fame: 7980, guild: "백두문" },
  { name: "야월비도", job: "도적", level: 98, hwansan: 369, fame: 7820, guild: "야행단" },
  { name: "뇌전술사", job: "주술사", level: 98, hwansan: 381, fame: 8410, guild: "천도문" },
  { name: "백의신선", job: "도사", level: 97, hwansan: 355, fame: 7440, guild: "고려무신" },
  { name: "강철주먹", job: "전사", level: 97, hwansan: 351, fame: 7210, guild: "야행단" },
  { name: "은신귀영", job: "도적", level: 97, hwansan: 348, fame: 7150, guild: "백두문" },
  { name: "화염도사", job: "주술사", level: 96, hwansan: 339, fame: 6880, guild: "현무회" },
  { name: "치유의손", job: "도사", level: 96, hwansan: 332, fame: 6640, guild: "현무회" },
  { name: "무쌍전사", job: "전사", level: 96, hwansan: 328, fame: 6510, guild: "고려무신" },
  { name: "단도수련생", job: "도적", level: 95, hwansan: 318, fame: 6200, guild: "야행단" },
  { name: "수룡주술", job: "주술사", level: 95, hwansan: 322, fame: 6350, guild: "천도문" },
  { name: "선풍도인", job: "도사", level: 95, hwansan: 309, fame: 5980, guild: "백두문" },
  { name: "대장군", job: "전사", level: 94, hwansan: 301, fame: 5760, guild: "현무회" },
  { name: "표창의달인", job: "도적", level: 94, hwansan: 298, fame: 5640, guild: "고려무신" },
  { name: "빙결마도", job: "주술사", level: 94, hwansan: 305, fame: 5880, guild: "야행단" },
  { name: "산신령", job: "도사", level: 93, hwansan: 288, fame: 5410, guild: "현무회" },
  { name: "패도무신", job: "전사", level: 93, hwansan: 285, fame: 5320, guild: "백두문" },
  { name: "흑야자객", job: "도적", level: 93, hwansan: 281, fame: 5210, guild: "야행단" },
  { name: "벼락술객", job: "주술사", level: 92, hwansan: 277, fame: 5080, guild: "천도문" },
  { name: "백련도사", job: "도사", level: 92, hwansan: 271, fame: 4920, guild: "고려무신" },
  { name: "무명검객", job: "전사", level: 91, hwansan: 263, fame: 4710, guild: "현무회" },
  { name: "쾌속단검", job: "도적", level: 91, hwansan: 259, fame: 4630, guild: "백두문" },
  { name: "풍운주술", job: "주술사", level: 90, hwansan: 252, fame: 4480, guild: "야행단" },
  { name: "운수도인", job: "도사", level: 90, hwansan: 248, fame: 4350, guild: "천도문" },
  { name: "초보무사", job: "전사", level: 88, hwansan: 231, fame: 3980, guild: "현무회" },
];

const guilds = [
  { name: "고려무신", master: "천하무적", members: 48, power: 18420, territory: "국내성" },
  { name: "천도문", master: "오행지존", members: 45, power: 17980, territory: "부여성" },
  { name: "백두문", master: "바람의검", members: 42, power: 16340, territory: "백두산" },
  { name: "야행단", master: "야월비도", members: 39, power: 15210, territory: "남만" },
  { name: "현무회", master: "산신령", members: 36, power: 13870, territory: "현무도" },
];

// 환산 내림차순 정렬 + 순위 부여
function rank(list) {
  return [...list]
    .sort((a, b) => b.hwansan - a.hwansan || b.fame - a.fame)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}

module.exports = {
  // 종합 랭킹 (전체)
  getCharacters: () => rank(characters),
  // 직업별 랭킹
  getByJob: (job) => rank(characters.filter((c) => c.job === job)),
  // 문파 랭킹 (세력 내림차순)
  getGuilds: () =>
    [...guilds]
      .sort((a, b) => b.power - a.power)
      .map((g, i) => ({ ...g, rank: i + 1 })),
};

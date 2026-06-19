// 바람의나라 몬스터 정보 — game_info/monster_notion_db.csv 를 파싱해서 생성
const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "game_info", "monster_notion_db.csv");

// 따옴표를 고려한 CSV 한 줄 파싱
function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { fields.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

const v = (f, i) => (f[i] || "").trim();

// "물망동1,물망동2" → ["물망동1","물망동2"]
function splitList(raw) {
  return (raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function load() {
  let text = fs.readFileSync(CSV_PATH, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 제거
  const lines = text.split(/\r?\n/);
  const monsters = [];
  let id = 0;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const f = parseCsvLine(lines[i]);
    const name = v(f, 0);
    if (!name) continue;
    const hp = v(f, 1);
    const mp = v(f, 2);
    const exp = v(f, 3);
    monsters.push({
      id: ++id,
      name,
      hp: hp ? Number(hp) : null,
      mp: mp ? Number(mp) : null,
      exp: exp ? Number(exp) : null,
      fields: splitList(v(f, 4)),
      drops: splitList(v(f, 5)),
    });
  }
  return monsters;
}

const monsters = load();

// 숫자 천단위 콤마
function fmt(n) {
  return n == null ? "-" : n.toLocaleString("ko-KR");
}

module.exports = {
  fmt,
  getAll: () => monsters,
  // 이름 또는 사냥터/드랍 아이템으로 검색
  search: (q) => {
    const kw = (q || "").trim().toLowerCase();
    if (!kw) return monsters;
    return monsters.filter(
      (m) =>
        m.name.toLowerCase().includes(kw) ||
        m.fields.some((x) => x.toLowerCase().includes(kw)) ||
        m.drops.some((x) => x.toLowerCase().includes(kw))
    );
  },
};

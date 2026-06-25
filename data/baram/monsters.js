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

// "물망동1; 물망동2" → ["물망동1","물망동2"]
function splitList(raw) {
  return (raw || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// "5000" → 5000 (숫자) / "3500~4000" → 그대로 문자열 유지 (범위값), 정렬용 평균값도 함께 반환
function parseMaybeRange(raw) {
  if (!raw) return { value: null, sortKey: null };
  if (raw.includes("~")) {
    const [min, max] = raw.split("~").map(Number);
    return { value: raw, sortKey: (min + max) / 2 };
  }
  const num = Number(raw);
  return { value: num, sortKey: num };
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
    const name = v(f, 1);
    if (!name) continue;

    const hp = parseMaybeRange(v(f, 2));
    const exp = parseMaybeRange(v(f, 3));
    const atk = parseMaybeRange(v(f, 4));
    const def = parseMaybeRange(v(f, 5));

    monsters.push({
      id: ++id,
      monsterId: v(f, 0),
      name,
      hp: hp.value,
      hpSort: hp.sortKey,
      exp: exp.value,
      atk: atk.value,
      def: def.value,
      fields: splitList(v(f, 6)),
      // 한글이 아닌 깨진 값(해시값 등)은 제외
      drops: splitList(v(f, 8)).filter((d) => /[가-힣]/.test(d)),
    });
  }
  // HP 오름차순 정렬 (낮은 순서 → 높은 순서)
  monsters.sort((a, b) => (a.hpSort ?? -Infinity) - (b.hpSort ?? -Infinity));
  return monsters;
}

const monsters = load();

// 숫자 천단위 콤마 (범위값 "3500~4000"은 양쪽 다 콤마 포맷)
function fmt(n) {
  if (n == null) return "-";
  if (typeof n === "string" && n.includes("~")) {
    return n.split("~").map((p) => Number(p).toLocaleString("ko-KR")).join("~");
  }
  return Number(n).toLocaleString("ko-KR");
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

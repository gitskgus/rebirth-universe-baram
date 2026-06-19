// 바람의나라 아이템 정보 — game_info/item_info.csv 를 파싱해서 생성
const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "game_info", "item_info.csv");

// 카테고리 (CSV 등장 순서 기준 노출 순서)
const CATEGORIES = ["무기", "방어구", "악세서리", "소모품"];
const CATEGORY_COLORS = {
  무기: "#8E2031",
  방어구: "#1F5C82",
  악세서리: "#6B3FA0",
  소모품: "#2D6E5E",
};

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

// 컬럼 인덱스
const COL = {
  category: 0, sub: 1, id: 2, name: 3, price: 4, durability: 5,
  sMin: 6, sMax: 7, lMin: 8, lMax: 9, def: 10, hit: 11, atk: 12,
  hp: 13, mp: 14, str: 15, dex: 16, int: 17, hpPct: 18, mpPct: 19,
  job: 20, level: 21, gender: 22, reqStr: 23, reqDex: 24, reqInt: 25,
  tradable: 26,
};

const v = (f, i) => (f[i] || "").trim();

// 최소~최대 범위 표기 ("5" / "5~10")
function range(min, max) {
  if (!min && !max) return "";
  if (min && max) return min === max ? min : `${min}~${max}`;
  return min || max;
}

// 전투/능력치 칩 생성
function buildStats(f) {
  const stats = [];
  const push = (label, value) => { if (value !== "" && value != null) stats.push({ label, value: String(value) }); };
  push("소공", range(v(f, COL.sMin), v(f, COL.sMax)));
  push("대공", range(v(f, COL.lMin), v(f, COL.lMax)));
  push("공격력", v(f, COL.atk));
  push("방어", v(f, COL.def));
  push("명중", v(f, COL.hit));
  push("HP", v(f, COL.hp));
  push("MP", v(f, COL.mp));
  push("힘", v(f, COL.str));
  push("민첩", v(f, COL.dex));
  push("지력", v(f, COL.int));
  push("HP%", v(f, COL.hpPct));
  push("MP%", v(f, COL.mpPct));
  return stats;
}

// 착용/사용 조건 칩 생성
function buildReqs(f) {
  const reqs = [];
  const push = (label, value) => { if (value !== "" && value != null) reqs.push({ label, value: String(value) }); };
  push("직업", v(f, COL.job));
  push("레벨", v(f, COL.level));
  push("성별", v(f, COL.gender));
  push("필요 힘", v(f, COL.reqStr));
  push("필요 민첩", v(f, COL.reqDex));
  push("필요 지력", v(f, COL.reqInt));
  return reqs;
}

function load() {
  let text = fs.readFileSync(CSV_PATH, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 제거
  const lines = text.split(/\r?\n/);
  const items = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const f = parseCsvLine(lines[i]);
    const name = v(f, COL.name);
    if (!name) continue;
    items.push({
      id: v(f, COL.id),
      name,
      category: v(f, COL.category),
      sub: v(f, COL.sub),
      price: v(f, COL.price) || null,
      durability: v(f, COL.durability) || null,
      tradable: v(f, COL.tradable) === "거래가능",
      stats: buildStats(f),
      reqs: buildReqs(f),
    });
  }
  return items;
}

const items = load();

module.exports = {
  CATEGORIES,
  CATEGORY_COLORS,
  getAll: () => items,
  getByCategory: (cat) => items.filter((it) => it.category === cat),
};

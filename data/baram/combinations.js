// 바람의나라 아이템 조합법 — game_info/item_recipe.csv 를 파싱해서 생성
const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "game_info", "item_recipe.csv");

// 결과아이템ID 접두사 → 한글 분류
const PREFIX_CATEGORY = {
  consumable: "음식",
  sword: "검",
  spear: "창",
  bow: "활",
  helmet: "투구",
  armour: "갑옷",
  accessory: "장신구",
};

// 탭에 노출할 분류 순서
const CATEGORIES = ["음식", "검", "창", "활", "투구", "갑옷", "장신구"];
const CATEGORY_COLORS = {
  음식: "#2D6E5E",
  검: "#8E2031",
  창: "#C0561E",
  활: "#1F8A70",
  투구: "#1F5C82",
  갑옷: "#4A6B2D",
  장신구: "#B8860B",
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

function categoryOf(id) {
  const prefix = (id.split("_")[0] || "").toLowerCase();
  return PREFIX_CATEGORY[prefix] || "기타";
}

function load() {
  if (!fs.existsSync(CSV_PATH)) return []; // CSV 가 없으면 빈 목록
  let text = fs.readFileSync(CSV_PATH, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 제거
  const lines = text.split(/\r?\n/);
  const combos = [];
  let id = 0;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const f = parseCsvLine(lines[i]);
    const itemId = (f[0] || "").trim();
    const name = (f[1] || "").trim();
    if (!itemId || !name) continue;

    // 재료1 ~ 재료12 (7번째 칼럼부터)
    const materials = [];
    for (let c = 6; c < f.length; c++) {
      const mat = (f[c] || "").trim();
      if (mat) materials.push(mat);
    }
    if (!materials.length) continue; // 재료 없는 행은 제외

    const rateStr = (f[3] || "").trim();
    const costStr = (f[4] || "").trim();

    combos.push({
      id: ++id,
      itemId,
      name,
      category: categoryOf(itemId),
      materials,
      rate: rateStr ? parseInt(rateStr, 10) : null,
      cost: costStr ? parseInt(costStr, 10) : null,
      failItem: (f[5] || "").trim() || null,
    });
  }
  return combos;
}

const combinations = load();

module.exports = {
  CATEGORIES,
  CATEGORY_COLORS,
  getAll: () => combinations,
  getByCategory: (cat) => combinations.filter((c) => c.category === cat),
};

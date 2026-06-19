require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { create, findByEmail } = require("../models/user");

const admins = [
  { username: "admin",  email: "admin@rebirthUniverse.kr" },
  { username: "admin1", email: "admin1@rebirthUniverse.kr" },
  { username: "admin2", email: "admin2@rebirthUniverse.kr" },
];

// 임시 비밀번호 — 실행 후 반드시 변경하세요
const TEMP_PASSWORD = "RebAdmin1234!";

async function run() {
  for (const { username, email } of admins) {
    const existing = await findByEmail(email);
    if (existing) {
      console.log(`[SKIP] 이미 존재: ${email} (role: ${existing.role})`);
      continue;
    }
    const user = await create({ username, email, password: TEMP_PASSWORD });
    console.log(`[OK] 생성 완료: ${email} (role: ${user.role})`);
  }
  console.log("\n임시 비밀번호:", TEMP_PASSWORD);
  console.log("로그인 후 반드시 비밀번호를 변경하세요.");
}

run().catch(console.error);

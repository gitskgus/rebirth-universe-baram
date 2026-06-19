const bcrypt = require("bcryptjs");
const datastore = require("../lib/datastore");

const KIND = "User";

// email을 named key로 사용 → 쿼리 없이 직접 조회 가능 (인덱스 불필요)
function userKey(email) {
  return datastore.key([KIND, email]);
}

async function findByEmail(email) {
  const [entity] = await datastore.get(userKey(email));
  if (!entity) return null;
  return _toUser(entity);
}

async function findById(id) {
  // id === email (named key)
  return findByEmail(id);
}

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
);

async function create({ username, email, password }) {
  const hashed = await bcrypt.hash(password, 10);
  const role = ADMIN_EMAILS.has(email.toLowerCase()) ? "admin" : "user";
  const entity = {
    key: userKey(email),
    data: [
      { name: "username",  value: username },
      { name: "email",     value: email, excludeFromIndexes: true },
      { name: "password",  value: hashed, excludeFromIndexes: true },
      { name: "role",      value: role },
      { name: "createdAt", value: new Date() },
    ],
  };
  await datastore.save(entity);
  return { id: email, username, email, role };
}

function _toUser(entity) {
  const key = entity[datastore.KEY];
  return {
    id:        key.name, // email이 곧 id
    username:  entity.username,
    email:     entity.email,
    password:  entity.password,
    role:      entity.role,
    createdAt: entity.createdAt,
  };
}

module.exports = { findByEmail, findById, create };

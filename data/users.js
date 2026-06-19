const bcrypt = require("bcryptjs");

// 더미 유저 데이터 (실제 서비스에선 DB 사용)
// 비밀번호: password123
const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@mapleplanet.kr",
    password: bcrypt.hashSync("password123", 10),
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    username: "메이플러",
    email: "user@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
    createdAt: new Date("2024-03-15"),
  },
];

let nextId = 3;

function findByEmail(email) {
  return users.find((u) => u.email === email);
}

function findById(id) {
  return users.find((u) => u.id === id);
}

function create({ username, email, password }) {
  const hashed = bcrypt.hashSync(password, 10);
  const user = { id: nextId++, username, email, password: hashed, role: "user", createdAt: new Date() };
  users.push(user);
  return user;
}

module.exports = { findByEmail, findById, create };

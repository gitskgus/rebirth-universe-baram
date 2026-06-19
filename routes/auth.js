const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const users = require("../models/user");

router.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("auth/login", { error: null, user: null, redirect: req.query.redirect || "/" });
});

router.post("/login", async (req, res) => {
  const { email, password, redirect } = req.body;
  try {
    const user = await users.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("auth/login", { error: "이메일 또는 비밀번호가 올바르지 않습니다.", user: null, redirect: redirect || "/" });
    }
    req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role };
    res.redirect(redirect || "/");
  } catch (err) {
    console.error("로그인 오류:", err);
    res.render("auth/login", { error: "서버 오류가 발생했습니다.", user: null, redirect: redirect || "/" });
  }
});

router.get("/register", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("auth/register", { error: null, user: null });
});

router.post("/register", async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    return res.render("auth/register", { error: "비밀번호가 일치하지 않습니다.", user: null });
  }
  try {
    if (await users.findByEmail(email)) {
      return res.render("auth/register", { error: "이미 사용 중인 이메일입니다.", user: null });
    }
    await users.create({ username, email, password });
    res.redirect("/auth/login");
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.render("auth/register", { error: "서버 오류가 발생했습니다.", user: null });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

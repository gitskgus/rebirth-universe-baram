require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "noljaverse-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// 링크 공유 미리보기(og:image 등)용 절대 URL — 모든 뷰에서 siteUrl/originalUrl 로 사용 가능
app.use((req, res, next) => {
  res.locals.siteUrl = `${req.protocol}://${req.get("host")}`;
  res.locals.originalUrl = req.originalUrl;
  next();
});

// 루트 → 바람의나라로 이동
app.get("/", (req, res) => res.redirect("/baram"));

// 통합 인증
app.use("/auth", require("./routes/auth"));

// 바람의나라 서브사이트
app.use("/baram", require("./routes/baram/index"));
app.use("/baram/guide", require("./routes/baram/guide"));
app.use("/baram/info", require("./routes/baram/info"));
app.use("/baram/item-info", require("./routes/baram/itemInfo"));
app.use("/baram/monster-info", require("./routes/baram/monsterInfo"));
app.use("/baram/item-combination", require("./routes/baram/itemCombination"));
app.use("/baram/shortcuts", require("./routes/baram/shortcuts"));
app.use("/baram/rankings", require("./routes/baram/rankings"));
app.use("/baram/board", require("./routes/baram/board"));
app.use("/baram/event", require("./routes/baram/event"));
app.use("/baram/faq", require("./routes/baram/faq"));
app.use("/baram/help", require("./routes/baram/help"));

// 404 핸들러
app.use((req, res) => {
  res.status(404).render("shared/error/404", { user: req.session.user || null });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("shared/error/404", { user: req.session.user || null });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`바람의나라 실행 중 → http://localhost:${PORT}/baram`);
});

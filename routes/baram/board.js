const express = require("express");
const router = express.Router();
const notices = require("../../data/baram/notices");
const updates = require("../../data/baram/updates");
const posts = require("../../data/baram/posts");
const { requireLogin, requireAdmin } = require("../../middleware/auth");

const PAGE_SIZE = 10;

function paginate(items, page) {
  const total = items.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const current = Math.max(1, Math.min(page, totalPages || 1));
  const sliced = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  return { items: sliced, current, totalPages };
}

// 공지사항
router.get("/notice", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { items, current, totalPages } = paginate(notices.getAll(), page);
  res.render("baram/board/list", { items, current, totalPages, boardType: "notice", boardName: "공지사항", basePath: "/baram", user: req.session.user || null });
});

router.get("/notice/write", requireAdmin, (req, res) => {
  res.render("baram/board/write", { boardType: "notice", boardName: "공지사항", basePath: "/baram", user: req.session.user, error: null, extraFields: ["isPinned"], useEditor: true, content: "" });
});

router.post("/notice/write", requireAdmin, (req, res) => {
  const { title, content, isPinned } = req.body;
  if (!title || !content) {
    return res.render("baram/board/write", { boardType: "notice", boardName: "공지사항", basePath: "/baram", user: req.session.user, error: "제목과 내용을 입력해주세요.", extraFields: ["isPinned"], useEditor: true, content: content || "" });
  }
  const notice = notices.create({ title, content, author: req.session.user.username, isPinned: isPinned === "on" });
  res.redirect(`/baram/board/notice/${notice.id}`);
});

router.get("/notice/:id", (req, res) => {
  const notice = notices.getById(req.params.id);
  if (!notice) return res.status(404).render("shared/error/404", { user: req.session.user || null });
  res.render("baram/board/detail", { post: notice, boardType: "notice", boardName: "공지사항", basePath: "/baram", user: req.session.user || null });
});

// 업데이트 노트
router.get("/update", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { items, current, totalPages } = paginate(updates.getAll(), page);
  res.render("baram/board/list", { items, current, totalPages, boardType: "update", boardName: "업데이트", basePath: "/baram", user: req.session.user || null });
});

router.get("/update/write", requireAdmin, (req, res) => {
  res.render("baram/board/write", { boardType: "update", boardName: "업데이트", basePath: "/baram", user: req.session.user, error: null, extraFields: [], useEditor: true, content: "" });
});

router.post("/update/write", requireAdmin, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.render("baram/board/write", { boardType: "update", boardName: "업데이트", basePath: "/baram", user: req.session.user, error: "제목과 내용을 입력해주세요.", extraFields: [], useEditor: true, content: content || "" });
  }
  const update = updates.create({ title, content, author: req.session.user.username });
  res.redirect(`/baram/board/update/${update.id}`);
});

router.get("/update/:id", (req, res) => {
  const update = updates.getById(req.params.id);
  if (!update) return res.status(404).render("shared/error/404", { user: req.session.user || null });
  res.render("baram/board/detail", { post: update, boardType: "update", boardName: "업데이트", basePath: "/baram", user: req.session.user || null });
});

// 자유게시판
router.get("/free", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { items, current, totalPages } = paginate(posts.getAll(), page);
  res.render("baram/board/list", { items, current, totalPages, boardType: "free", boardName: "자유게시판", basePath: "/baram", user: req.session.user || null });
});

router.get("/free/write", requireLogin, (req, res) => {
  res.render("baram/board/write", { boardType: "free", boardName: "자유게시판", basePath: "/baram", user: req.session.user || null, error: null, extraFields: [], useEditor: false, content: "" });
});

router.post("/free/write", requireLogin, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.render("baram/board/write", { boardType: "free", boardName: "자유게시판", basePath: "/baram", user: req.session.user || null, error: "제목과 내용을 입력해주세요.", extraFields: [], useEditor: false, content: content || "" });
  }
  const post = posts.create({ title, content, author: req.session.user.username });
  res.redirect(`/baram/board/free/${post.id}`);
});

router.get("/free/:id", (req, res) => {
  const post = posts.getById(req.params.id);
  if (!post) return res.status(404).render("shared/error/404", { user: req.session.user || null });
  posts.incrementViews(post.id);
  res.render("baram/board/detail", { post, boardType: "free", boardName: "자유게시판", basePath: "/baram", user: req.session.user || null });
});

router.post("/free/:id/comment", requireLogin, (req, res) => {
  const { content } = req.body;
  if (content) {
    posts.addComment(parseInt(req.params.id), { author: req.session.user.username, content });
  }
  res.redirect(`/baram/board/free/${req.params.id}`);
});

module.exports = router;

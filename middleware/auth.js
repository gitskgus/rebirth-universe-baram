function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login?redirect=" + encodeURIComponent(req.originalUrl));
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login?redirect=" + encodeURIComponent(req.originalUrl));
  }
  if (req.session.user.role !== "admin") {
    return res.status(403).render("403", { user: req.session.user || null });
  }
  next();
}

module.exports = { requireLogin, requireAdmin };

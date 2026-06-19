const express = require("express");
const router = express.Router();
const rankings = require("../../data/baram/rankings");
const jobs = require("../../data/baram/jobs");

const JOB_TABS = ["전사", "도적", "주술사", "도사"];

router.get("/", (req, res) => {
  const tab = req.query.tab || "all"; // all | guild | 전사 | 도적 | 주술사 | 도사

  let rows = [];
  let isGuild = false;
  if (tab === "guild") {
    rows = rankings.getGuilds();
    isGuild = true;
  } else if (JOB_TABS.includes(tab)) {
    rows = rankings.getByJob(tab);
  } else {
    rows = rankings.getCharacters();
  }

  res.render("baram/rankings", {
    title: "랭킹",
    tab,
    rows,
    isGuild,
    jobTabs: JOB_TABS,
    jobMeta: jobs.meta,
    user: req.session.user || null,
  });
});

module.exports = router;

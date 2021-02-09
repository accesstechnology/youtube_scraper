const express = require("express");
const { default: youtube } = require("scrape-youtube");

const cache = require("../helpers/cache");

const Router = express.Router();

Router.get("/search", async (req, res) => {
  try {
    let { q, cached } = req.query;
    const allowCached = cached !== "false";
    if (!q) return res.send({ error: "Invalid query!" });
    q = q.trim();
    if (allowCached) {
      const cachedResults = await cache.getResults(q);
      if (cachedResults && cachedResults.length !== 0) {
        return res.send({ results: cachedResults, cached: true });
      }
    }
    let freshResults = await youtube.search(
      q,
      { safeSearch: true },
      { safeSearch: true, headers: { Cookie: "PREF=f2=8000000" } }
    );
    freshResults = freshResults.videos.map((video) => ({
      id: video.id,
      title: video.title,
    }));
    res.send({ results: freshResults, length: freshResults.length });
    if (freshResults.length > 0) await cache.saveResults(q, freshResults);
  } catch (error) {
    console.error(error);
    res.send({ error: "Backend error." });
  }
});

module.exports = Router;

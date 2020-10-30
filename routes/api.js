const express = require("express");
const { default: youtube } = require("scrape-youtube");

const cache = require("../helpers/cache");

const Router = express.Router();

Router.get("/search", async(req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.send({ error: "Invalid query!" });
    const cachedResults = await cache.getResults(q);
    if (cachedResults) return res.send({ results: cachedResults, cached: true });
    let freshResults = await youtube.search(
      q, { safeSearch: true }, { safeSearch: true, headers: { Cookie: "PREF=f2=8000000" } }
    );
    freshResults = freshResults.map((video) => ({
      id: video.id,
      title: video.title,
    }));
    res.send({ results: freshResults, length: freshResults.length });
    await cache.saveResults(q, freshResults);
  }
  catch (error) {
    console.error(error);
    res.send({ error: "Backend has occured!" });
  }
});

module.exports = Router;

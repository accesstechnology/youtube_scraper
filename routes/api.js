const express = require("express");
const { default: youtube } = require("scrape-youtube");

const Router = express.Router();

Router.get("/search", (req, res) => {
  const { q } = req.query;
  youtube
    .search(q || "")
    .then((results) =>
      res.send({
        results: results.map((video) => ({ id: video.id, title: video.title })),
        length: results.length,
      })
    )
    .catch((error) => res.send(error));
});

module.exports = Router;
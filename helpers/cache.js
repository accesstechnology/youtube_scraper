const redisClient = require("./redis");
const config = require("../config");

function saveResults(query, results) {
  return new Promise((resolve, reject) => {
    redisClient.set(query, JSON.stringify(results), (error) => {
      if (error) return reject(error);
      redisClient.expire(query, config.cache.expireTime, (error) => {
        if (error) return reject(error);
        return resolve(true);
      });
    });
  });
}

function getResults(query) {
  return new Promise((resolve, reject) => {
    redisClient.get(query, (error, results) => {
      if (error) return reject(error);
      return resolve(JSON.parse(results));
    });
  });
}

module.exports = { saveResults, getResults };

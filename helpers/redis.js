const redis = require("redis");
const client = redis.createClient({host:'youtube_cache'});

client.on("error", (error) => console.error(error));

client.on("connect", () => console.log("Connected with Redis!"));

module.exports = client;

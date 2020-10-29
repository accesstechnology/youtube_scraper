const express = require("express");

const config = require("./config");

const app = express();

app.use("/api", require("./routes/api"));

app.listen(config.port, () => console.log(`Server started at ${config.port}`));

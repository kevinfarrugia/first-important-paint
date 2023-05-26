/* eslint-disable @typescript-eslint/no-var-requires */
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs-extra");
const { configure, render } = require("nunjucks");

const app = express();
const BEACON_FILE = "test/beacons.log";

configure("./test/views/", { noCache: true });

// Turn off all caching for tests.
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache, no-store");
  next();
});

// Allow the use of a `delay` query param to delay any response.
app.use((req, res, next) => {
  if (req.query && req.query.delay) {
    setTimeout(next, req.query.delay);
  } else {
    next();
  }
});

// Simulate an API that sends a random string
app.get("/api/:length", (req, res) => {
  const length = parseInt(req.params.length, 10);
  const data = Array.from({ length })
    .map(() => Math.random().toString(36).charAt(2))
    .join("");
  res.contentType("application/json");
  res.send(JSON.stringify({ data }));
});

// Add a "collect" endpoint to simulate analytics beacons.
app.post("/collect", bodyParser.text(), (req, res) => {
  // console.log(JSON.stringify(JSON.parse(req.body), null, 2));

  fs.appendFileSync(BEACON_FILE, `${req.body}\n`);
  res.end();
});

app.get("/test/:view", (req, res) => {
  const data = {
    ...req.query,
    modulePath: `/dist/first-important-paint.js`,
  };
  res.send(render(`${req.params.view}.njk`, data));
});

app.use(express.static("./"));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.info(`Server running on localhost:${listener.address().port}`);
});

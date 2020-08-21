const express = require("express");
const bodyParser = require("body-parser");
const initDb = require("./api/helpers/db").initDb;

const app = express();
const port = 5000;
const route = require("./api/routes");

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", route);

initDb(function (err) {
  app.listen(port, function () {
    console.log(`Started server on port ${port}`);
  });
});

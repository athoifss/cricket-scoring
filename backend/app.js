const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const initDb = require("./helper/db").initDb;
const getDb = require("./helper/db").getDb;

const app = express();

app.use((req, res, next) => {
  console.log(`request for ${req.url}`);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/user/add", (req, res, next) => {
  console.log(req.body);
  const dbo = getDb();
  let newData = req.body;
  dbo.collection("user").insertOne(newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({
        message: "Could not add new record",
      });
    } else {
      res.status(200).json({
        message: "User added",
      });
    }
  });
});

const port = 5000;
initDb(function (err) {
  app.listen(port, function () {
    console.log(`Started server on port ${port}`);
  });
});

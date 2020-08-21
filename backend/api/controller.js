const getDb = require("./helpers/db").getDb;
const time = require("./helpers/time");

exports.addNewUser = function (req, res) {
  const { name, username, password } = req.body;
  const dbo = getDb();
  dbo
    .collection("user")
    .insertOne({ name, username, password }, (error, result) => {
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
};

exports.addNewMatch = function (req, res) {
  const dbo = getDb();
  const { teamHome, teamAway, venue } = req.body;
  let currTime = time.getCurrTime();
  let newData = {
    teamHome,
    teamAway,
    venue,
    batting: [],
    bowling: [],
    extras: [],
    howOut: [],
    ballByBall: [],
    time: currTime,
  };
  dbo.collection("match").insertOne(newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({
        message: "Could not add new record",
      });
    } else {
      res.status(200).json({
        message: "Match added",
      });
    }
  });
};

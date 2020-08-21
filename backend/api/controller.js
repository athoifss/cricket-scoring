const getDb = require("./helpers/db").getDb;
const time = require("./helpers/time");
const misc = require("./helpers/misc");
const ObjectId = require("mongodb").ObjectID;

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

exports.addNewBowl = function (req, res) {
  const dbo = getDb();
  const { matchId, name } = req.body;
  let bowlUid = `bat_${matchId}_${misc.randomString(5)}`;

  let findData = {
    _id: ObjectId(matchId),
  };

  let newData = {
    $push: {
      bowling: {
        name: name,
        bowlUid,
        runs: 0,
        overs: 0,
        balls: 0,
        wickets: 0,
        economy: parseFloat(0),
      },
    },
  };

  dbo.collection("match").updateOne(findData, newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({
        message: "Could not add new record",
      });
    } else {
      res.status(200).json({
        message: "Bowl added",
      });
    }
  });
};

exports.addNewBat = function (req, res) {
  const dbo = getDb();
  const { matchId, name } = req.body;
  let batUid = `${matchId}_${misc.randomString(5)}`;

  let findData = {
    _id: ObjectId(matchId),
  };

  let newData = {
    $push: {
      batting: {
        name: name,
        batUid,
        runs: 0,
        balls: 0,
        strikeRate: parseFloat(0),
        "0s": 0,
        "1s": 0,
        "2s": 0,
        "3s": 0,
        "4s": 0,
        "5s": 0,
        "6s": 0,
      },
    },
  };

  dbo.collection("match").updateOne(findData, newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({
        message: "Could not add new record",
      });
    } else {
      res.status(200).json({
        message: "Bat added",
      });
    }
  });
};

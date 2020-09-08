const getDb = require("./helpers/db").getDb;
const time = require("./helpers/time");
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
    time: currTime,
    inn1: {
      striker: 0,
      nonStriker: 0,
      currBowler: 0,
    },
    inn2: {
      striker: 0,
      nonStriker: 0,
      currBowler: 0,
    },
  };
  dbo.collection("match").insertOne(newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({
        message: "Could not add new record",
      });
    } else {
      res.status(200).json({ message: "Success: New Match Added" });
    }
  });
};

exports.addNewBat = function (req, res) {
  const dbo = getDb();
  const { matchId, num, name, innings } = req.body;

  let newData = {
    match: ObjectId(matchId),
    innings: parseInt(innings),
    num: parseInt(num),
    name,
    "1s": 0,
    "2s": 0,
    "3s": 0,
    "4s": 0,
    "5s": 0,
    "6s": 0,
    balls: 0,
  };
  dbo.collection("batting").insertOne(newData, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "Could not add new record",
      });
    } else {
      res.status(200).json({ message: "Added new bat" });
    }
  });
};

exports.addNewBowl = function (req, res) {
  const dbo = getDb();
  const { matchId, num, name, innings } = req.body;

  let newData = {
    match: ObjectId(matchId),
    name,
    innings: parseInt(innings),
    num: parseInt(num),
    runs: 0,
    ballsActual: 0,
    ballsLegal: 0,
    wickets: 0,
  };
  dbo.collection("bowling").insertOne(newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({
        message: "Could not add new bowler",
      });
    } else {
      res.status(200).json({
        message: "Success: New Bowler Added",
      });
    }
  });
};

exports.ballSubmit = async function (req, res) {
  const {
    matchId,
    innings,
    ballActual,
    ballLegal,
    batNum,
    bowlNum,
    nxtStriker,
    nxtNonStriker,
    runs,
    isBallLegal,
    isOut,
    extras,
  } = req.body;
  try {
    await updateBat(matchId, innings, batNum, runs, isOut);
    await updateBowl(matchId, innings, bowlNum, runs, isBallLegal, isOut);
    await updateMatchData(matchId, innings, nxtStriker, nxtNonStriker);
    await updateBallByBall(
      matchId,
      innings,
      batNum,
      bowlNum,
      ballActual,
      ballLegal,
      runs,
      extras
    );
    console.log("Bat && Bowl && Match && BallByBall Updated");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error: Could not do submit" });
  }
};

exports.outSubmit = async function (req, res) {
  const { matchId, innings, bowlNum, batNum, howOut, wicketNo } = req.body;

  let fielder;
  if (!req.body.fielder) {
    fielder = null;
  } else {
    fielder = req.body.fielder;
  }
  let newData = {
    match: ObjectId(matchId),
    innings: parseInt(innings),
    bowlNum: parseInt(bowlNum),
    batNum: parseInt(batNum),
    howOut,
    fielder,
    wicketNo: parseInt(wicketNo),
  };
  const dbo = getDb();
  dbo.collection("howOut").insertOne(newData, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Failed" });
    } else {
      res.status(200).json({ message: "Success" });
    }
  });
};

exports.changeCurrBowler = function (req, res) {
  const dbo = getDb();
  const { matchId, innings, bowlNum } = req.body;
  console.log(req.body);
  let findData = {
    _id: ObjectId(matchId),
  };

  let newData = {};
  if (parseInt(innings) == 1) {
    newData = {
      $set: {
        inn1: {
          currBowler: parseInt(bowlNum),
        },
      },
    };
  } else {
    newData = {
      $set: {
        inn2: {
          currBowler: parseInt(bowlNum),
        },
      },
    };
  }

  dbo.collection("match").updateOne(findData, newData, (error, result) => {
    if (error) {
      console.log(err);
      res.status(500).json({ message: "Error occured" });
    } else {
      res.status(200).json({ message: "Sucess" });
    }
  });
};

exports.battingGetAll = (req, res) => {
  const dbo = getDb();
  const matchId = req.params.matchId;
  let findData = {
    match: ObjectId(matchId),
  };
  dbo
    .collection("batting")
    .find(findData)
    .toArray((err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error" });
      } else {
        console.log(result)
        res.status(200).json(result);
      }
    });
};

function updateBat(matchId, innings, batNum, run, isOut) {
  return new Promise((resolve, reject) => {
    const dbo = getDb();
    let findData = {
      match: ObjectId(matchId),
      innings,
      num: batNum,
    };
    let runs = parseInt(run);
    let newData = {};
    switch (parseInt(runs)) {
      case 1:
        newData = {
          $inc: {
            "1s": 1,
          },
        };
        break;
      case 2:
        newData = {
          $inc: {
            "2s": 1,
          },
        };
        break;
      case 3:
        newData = {
          $inc: {
            "3s": 1,
          },
        };
        break;
      case 4:
        newData = {
          $inc: {
            "4s": 1,
          },
        };
        break;
      case 5:
        newData = {
          $inc: {
            "5s": 1,
          },
        };
        break;

      case 6:
        newData = {
          $inc: {
            "6s": runs,
          },
        };
        break;
    }
    newData["$inc"].balls = 1;
    dbo.collection("batting").updateOne(findData, newData, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function updateBowl(matchId, innings, bowlNum, run, isBallLegal, isOut) {
  return new Promise((resolve, reject) => {
    const dbo = getDb();
    let findData = {
      match: ObjectId(matchId),
      num: parseInt(bowlNum),
      innings,
    };
    let newData = {
      $inc: {
        runs: parseInt(run),
      },
    };
    newData["$inc"].ballsActual = 1;
    if (isBallLegal) {
      newData["$inc"].ballsLegal = 1;
    }
    if (isOut) {
      newData["$inc"].wickets = 1;
    }
    dbo.collection("bowling").updateOne(findData, newData, (error, result) => {
      if (error) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function updateBallByBall(
  matchId,
  innings,
  batNum,
  bowlNum,
  ballActual,
  ballLegal,
  runs,
  extras,
  nxtStriker,
  nxtNonStriker
) {
  return new Promise((resolve, reject) => {
    const dbo = getDb();
    let newData = {
      matchId: ObjectId(matchId),
      innings: parseInt(innings),
      batNum: parseInt(batNum),
      bowlNum: parseInt(bowlNum),
      ballActual: parseInt(ballActual),
      ballLegal: parseInt(ballLegal),
      runs: parseInt(runs),
      extras,
      nxtStriker: parseInt(nxtStriker),
      nxtNonStriker: parseInt(nxtNonStriker),
    };

    dbo.collection("ballByBall").insertOne(newData, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function updateMatchData(matchId, innings, nxtStriker, nxtNonStriker) {
  const dbo = getDb();
  return new Promise((resolve, reject) => {
    let findData = {
      _id: ObjectId(matchId),
    };

    let newData = {};
    if (parseInt(innings) == 1) {
      newData = {
        $set: {
          inn1: {
            striker: parseInt(nxtStriker),
            nonStriker: parseInt(nxtNonStriker),
          },
        },
      };
    } else {
      newData = {
        $set: {
          inn2: {
            striker: parseInt(nxtStriker),
            nonStriker: parseInt(nxtNonStriker),
          },
        },
      };
    }
    dbo.collection("match").updateOne(findData, newData, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

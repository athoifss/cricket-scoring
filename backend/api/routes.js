const router = require("express").Router();
const api = require("./controller");

router.post("/user/add", (req, res) => {
  api.addNewUser(req, res);
});

router.post("/match/new", (req, res) => {
  api.addNewMatch(req, res);
});

router.post("/bat/add", (req, res) => {
  api.addNewBat(req, res);
});

router.post("/bowl/add", (req, res) => {
  api.addNewBowl(req, res);
});

module.exports = router;

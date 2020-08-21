const router = require("express").Router();
const api = require("./controller");

router.post("/user/add", (req, res) => {
  api.addNewUser(req, res);
});

router.post("/match/new", (req, res) => {
  api.addNewMatch(req, res);
});

module.exports = router;

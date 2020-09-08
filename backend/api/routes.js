const router = require("express").Router();
const api = require("./controller");

router.post("/user/add", (req, res) => {
  api.addNewUser(req, res);
});

router.post("/match", (req, res) => {
  api.addNewMatch(req, res);
});

router.post("/bat", (req, res) => {
  api.addNewBat(req, res);
});

router.post("/bowl", (req, res) => {
  api.addNewBowl(req, res);
});

router.post("/ball", (req, res) => {
  api.ballSubmit(req, res);
});

router.post("/out", (req, res) => {
  api.outSubmit(req, res);
});

router.get("/bat/:matchId", (req, res) => {
  api.battingGetAll(req, res);
});

router.get("/bowl/:matchId", (req, res) => {
  api.bowlingGetAll(req, res);
});

router.get("/match/:matchId", (req,res)=>{
  api.matchGet(req,res);
})
router.get("/howOut/:matchId", (req,res)=>{
  api.howOutGetAll(req,res);
})

router.put("/currBowler", (req, res) => {
  api.changeCurrBowler(req, res);
});

module.exports = router;

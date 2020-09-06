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

router.post("/out", (req,res)=>{
  api.outSubmit(req,res)
})

module.exports = router;

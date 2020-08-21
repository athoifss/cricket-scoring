const router = require("express").Router();
const cont = require("./controller");

router.post("/user/add", (req, res) => {
  console.log("Route user add");
  cont.addNewUser(req, res);
});

module.exports = router;

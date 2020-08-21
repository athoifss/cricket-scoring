const getDb = require("./helpers/db").getDb;

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

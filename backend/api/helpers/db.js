var client = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

let _db;
function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }
  client.connect(
    url,
    {
      useUnifiedTopology: true,
    },
    connected
  );

  function connected(err, db) {
    if (err) {
      return callback(err);
    }
    console.log("DB initialized - connected");
    _db = db.db("scorecard");
    return callback(null, _db);
  }
}
function getDb() {
  return _db;
}

module.exports = {
  getDb,
  initDb,
};

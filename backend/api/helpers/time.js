const moment = require("moment-timezone");

exports.getCurrTime = function () {
  let time = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  return time;
};

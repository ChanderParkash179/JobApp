const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function mongoConnect(url) {
  return mongoose.connect(url);
}

module.exports = { mongoConnect };

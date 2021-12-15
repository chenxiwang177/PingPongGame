const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// List of columns for Employee schema
let SingleGameResultGameResult = new Schema(
  {
    UserName: {
      type: String,
    },
    UserScore: {
      type: Number,
    },
    BotScore: {
      type: Number,
    },
    time: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "SingleGameResultGameResult",
  }
);

module.exports = mongoose.model(
  "SingleGameResultGameResult",
  SingleGameResultGameResult
);

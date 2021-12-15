const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// List of columns for Employee schema
let MuliGameResult = new Schema(
  {
    roomName: {
      type: String,
    },
    playerOne: {
      type: String,
    },
    playerTwo: {
      type: String,
    },
    playerOneScore: {
      type: Number,
    },
    playerTwoScore: {
      type: Number,
    },
    time: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "MuliGameResult",
  }
);

module.exports = mongoose.model("MuliGameResult", MuliGameResult);

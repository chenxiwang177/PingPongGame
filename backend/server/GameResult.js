const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// List of columns for Employee schema
let GameResult = new Schema(
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
  },
  {
    collection: "gameresult",
  }
);

module.exports = mongoose.model("GameResult", GameResult);

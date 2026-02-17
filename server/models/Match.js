const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["SINGLES", "DOUBLES"],
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    duration: {
      type: Number,
      default: 20
    },

    playerLimit: {
      type: Number,
      required: true
    },

    // 🔥 NEW FIELD (VERY IMPORTANT)
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    queue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    status: {
      type: String,
      enum: ["WAITING", "FULL", "ONGOING", "COMPLETED"],
      default: "WAITING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);

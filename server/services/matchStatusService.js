const Match = require("../models/Match");

const startMatchWatcher = (io) => {

  setInterval(async () => {

    const now = new Date();

    const matches = await Match.find({
      status: { $in: ["WAITING", "FULL", "ONGOING"] }
    });

    for (const match of matches) {

      let updated = false;

      // ===============================
      // START MATCH (ONLY IF FULL)
      // ===============================
      if (
        match.status === "FULL" &&
        now >= match.startTime &&
        now < match.endTime
      ) {
        match.status = "ONGOING";
        updated = true;
      }

      // ===============================
      // COMPLETE MATCH
      // ===============================
      if (
        match.status === "ONGOING" &&
        now >= match.endTime
      ) {
        match.status = "COMPLETED";
        updated = true;
      }

      // ===============================
      // SAVE ONLY IF CHANGED
      // ===============================
      if (updated) {
        await match.save();
        io.emit("matchUpdated");
      }
    }

  }, 5000); // every 5 seconds
};

module.exports = startMatchWatcher;

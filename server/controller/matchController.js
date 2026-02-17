const Match = require("../models/Match");
const User = require("../models/User");
const admin = require("../config/firebaseAdmin");
const jwt = require("jsonwebtoken");

// =====================================================
// CREATE MATCH + AUTO ADD CREATOR + BROADCAST
// =====================================================
const createMatch = async (req, res) => {
  try {
    const { mode, startTime } = req.body;

    const playerLimit = mode === "SINGLES" ? 2 : 4;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + 20 * 60000);

    const creator = await User.findById(req.user.id);

    if (!creator)
      return res.status(404).json({ message: "Creator not found" });

    // 🔥 AUTO ADD CREATOR AS FIRST PLAYER
    const match = await Match.create({
      mode,
      startTime: start,
      endTime: end,
      playerLimit,
      status: "WAITING",
      creator: req.user.id,
      players: [req.user.id]
    });

    // If Singles and creator already fills slot (rare case)
    if (match.players.length === match.playerLimit) {
      match.status = "FULL";
      await match.save();
    }

    // Emit realtime update
    req.app.get("io").emit("matchUpdated");

    // Broadcast push notifications
    const users = await User.find({
      fcmToken: { $exists: true, $ne: null }
    });

    for (const user of users) {

      const actionToken = jwt.sign(
        {
          userId: user._id.toString(),
          matchId: match._id.toString()
        },
        process.env.ACTION_JWT_SECRET || process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      const message = {
        token: user.fcmToken,
        data: {
          matchId: match._id.toString(),
          actionToken,
          creatorName: creator.name
        },
        notification: {
          title: "New Match Invitation 🏓",
          body: `${creator.name} created a ${mode} match starting at ${start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}. Wanna join?`
        },
        webpush: {
          notification: {
            actions: [
              { action: "YES", title: "Yes 👍" },
              { action: "NO", title: "No ❌" }
            ],
            data: { actionToken }
          }
        }
      };

      try {
        await admin.messaging().send(message);
      } catch (err) {
        console.error("FCM error:", err.message);
      }
    }

    res.status(201).json(match);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// JOIN MATCH (Manual Join Button)
// =====================================================
const joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    const userId = req.user.id;

    if (!match)
      return res.status(404).json({ message: "Match not found" });

    // Prevent duplicate joins
    if (
      match.players.some(p => p.toString() === userId) ||
      match.queue.some(q => q.toString() === userId)
    ) {
      return res.status(400).json({ message: "Already joined" });
    }

    if (match.players.length < match.playerLimit) {
      match.players.push(userId);
    } else {
      match.queue.push(userId);
    }

    if (match.players.length === match.playerLimit)
      match.status = "FULL";

    await match.save();

    req.app.get("io").emit("matchUpdated");

    res.json(match);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// CANCEL MATCH + AUTO PROMOTION
// =====================================================
const cancelMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    const userId = req.user.id;

    if (!match)
      return res.status(404).json({ message: "Match not found" });

    // Remove user from players
    match.players = match.players.filter(
      p => p.toString() !== userId
    );

    // Remove user from queue
    match.queue = match.queue.filter(
      q => q.toString() !== userId
    );

    let promotedUserId = null;

    // Promote next in queue
    if (
      match.players.length < match.playerLimit &&
      match.queue.length > 0
    ) {
      promotedUserId = match.queue.shift();
      match.players.push(promotedUserId);
    }

    if (match.players.length < match.playerLimit)
      match.status = "WAITING";

    await match.save();

    req.app.get("io").emit("matchUpdated");

    // Notify promoted user
    if (promotedUserId) {
      const promotedUser = await User.findById(promotedUserId);

      if (promotedUser?.fcmToken) {
        await admin.messaging().send({
          token: promotedUser.fcmToken,
          notification: {
            title: "You're Confirmed! 🎉",
            body: "You have been promoted from queue."
          }
        });
      }
    }

    res.json(match);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// YES / NO FROM PUSH NOTIFICATION
// =====================================================
const respondWithActionToken = async (req, res) => {
  try {
    const { actionToken, action } = req.body;

    const decoded = jwt.verify(
      actionToken,
      process.env.ACTION_JWT_SECRET || process.env.JWT_SECRET
    );

    const { userId, matchId } = decoded;

    const match = await Match.findById(matchId);
    if (!match)
      return res.status(404).json({ message: "Match not found" });

    if (action === "YES") {

      if (
        match.players.some(p => p.toString() === userId) ||
        match.queue.some(q => q.toString() === userId)
      ) {
        return res.json({ message: "Already responded" });
      }

      if (match.players.length < match.playerLimit) {
        match.players.push(userId);
      } else {
        match.queue.push(userId);
      }

      if (match.players.length === match.playerLimit)
        match.status = "FULL";

      await match.save();

      req.app.get("io").emit("matchUpdated");

      return res.json({ message: "Joined successfully" });
    }

    return res.json({ message: "Declined" });

  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// =====================================================
// GET ALL MATCHES
// =====================================================
const getMatches = async (req, res) => {
  const matches = await Match.find()
    .populate("creator", "name")
    .populate("players", "name")
    .populate("queue", "name");

  res.json(matches);
};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  createMatch,
  joinMatch,
  cancelMatch,
  getMatches,
  respondWithActionToken
};

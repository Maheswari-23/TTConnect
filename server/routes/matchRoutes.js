const router = require("express").Router();

const {
  createMatch,
  joinMatch,
  cancelMatch,
  getMatches,
  respondWithActionToken
} = require("../controller/matchController");

const auth = require("../middleware/authMiddleware");

// Create match
router.post("/", auth, createMatch);

// Get matches
router.get("/", auth, getMatches);

// Join match
router.post("/join/:id", auth, joinMatch);

// Cancel match
router.post("/cancel/:id", auth, cancelMatch);

// YES / NO from notification (no auth needed – uses actionToken)
router.post("/respond", respondWithActionToken);

module.exports = router;

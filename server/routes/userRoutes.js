const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Save FCM token
router.post("/save-fcm-token", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fcmToken = req.body.token;
    await user.save();

    res.json({ message: "FCM token saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

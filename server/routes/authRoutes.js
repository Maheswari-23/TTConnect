const router = require("express").Router();
const {
  signup,
  login,
  saveFcmToken
} = require("../controller/authController");

const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/save-token", auth, saveFcmToken);

module.exports = router;




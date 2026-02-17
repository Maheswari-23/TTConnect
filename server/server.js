const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// ======================
// Middleware
// ======================

// ✅ UPDATED CORS (Works for both Local + Render)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ttconnect.onrender.com"
    ],
    credentials: true
  })
);

app.use(express.json());

// ======================
// Root Route
// ======================
app.get("/", (req, res) => {
  res.send("TTConnect Backend Running 🚀");
});

// ======================
// Routes
// ======================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ======================
// Socket.io Setup
// ======================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://ttconnect.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible inside controllers
app.set("io", io);

// Socket connection listener
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const startMatchWatcher = require("./services/matchStatusService");
startMatchWatcher(io);

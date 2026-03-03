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
// Allowed Origins
// ======================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ttconnect.onrender.com",
  "https://ttconnect-1.onrender.com"
];

// ======================
// Middleware
// ======================

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
    origin: allowedOrigins,
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

// ======================
// Match Status Watcher
// ======================

const startMatchWatcher = require("./services/matchStatusService");
startMatchWatcher(io);

const admin = require("firebase-admin");

// Load environment variables (only needed for local development)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Validate required env variables
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Firebase environment variables are not properly set");
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process
      .env
      .FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, "\n"), // Important for private key formatting
  }),
});

module.exports = admin;

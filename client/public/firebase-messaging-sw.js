importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAqPQySiO1OZl31oiMSq73SQLEoHvbPGJk",
  authDomain: "ttconnect-6d159.firebaseapp.com",
  projectId: "ttconnect-6d159",
  storageBucket: "ttconnect-6d159.firebasestorage.app",
  messagingSenderId: "1094557175374",
  appId: "1:1094557175374:web:a8ec882e0cbfb3c22cbd1f",
  measurementId: "G-YP9P46RZKX"
});

const messaging = firebase.messaging();

// ==========================================
// Dynamically resolve API base from service worker origin
// localhost:5173 → port 5002 (dev), production → same origin
// ==========================================
function getApiBase() {
  const origin = self.location.origin;
  // In development Vite runs on :5173, backend on :5002
  if (origin.includes("localhost:5173") || origin.includes("localhost:5174")) {
    return "http://localhost:5002";
  }
  // Production — backend and frontend on same domain via proxy or same server
  // Adjust this if your production backend is on a different domain
  return "https://ttconnect.onrender.com";
}

function getFrontendBase() {
  const origin = self.location.origin;
  if (origin.includes("localhost")) return origin;
  return "https://ttconnect-1.onrender.com";
}

// ==========================================
// BACKGROUND MESSAGE HANDLER
// ==========================================
messaging.onBackgroundMessage(function (payload) {
  try {
    const data = payload.data || {};
    const title = payload.notification?.title || "TTConnect";
    const body = payload.notification?.body || "New Match Available";

    const options = {
      body,
      icon: "/vite.svg",
      badge: "/vite.svg",
      data: {
        matchId: data.matchId,
        actionToken: data.actionToken
      },
      actions: [
        { action: "YES", title: "Join Match" },
        { action: "NO", title: "Decline" }
      ],
      requireInteraction: true
    };

    self.registration.showNotification(title, options);
  } catch (err) {
    console.error("Error showing background notification", err);
  }
});

// ==========================================
// NOTIFICATION CLICK HANDLER
// ==========================================
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  const API_URL = getApiBase();
  const FRONTEND_URL = getFrontendBase();

  if (data && data.actionToken && (action === "YES" || action === "NO")) {
    event.waitUntil(
      fetch(`${API_URL}/api/match/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionToken: data.actionToken, action })
      })
        .then(() => clients.openWindow(`${FRONTEND_URL}/dashboard`))
        .catch((err) => console.error("Notification response error:", err))
    );
  } else {
    event.waitUntil(clients.openWindow(`${FRONTEND_URL}/dashboard`));
  }
});

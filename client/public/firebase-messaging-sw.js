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

// =====================================
// BACKGROUND MESSAGE HANDLER
// =====================================
messaging.onBackgroundMessage(function (payload) {
  try {
    const data = payload.data || {};

    const title =
      (payload.notification && payload.notification.title) ||
      "TTConnect";

    const body =
      (payload.notification && payload.notification.body) ||
      "New Match Available";

    const options = {
      body,
      data: {
        matchId: data.matchId,
        actionToken: data.actionToken
      },
      actions: [
        { action: "YES", title: "Yes 👍" },
        { action: "NO", title: "No ❌" }
      ]
    };

    self.registration.showNotification(title, options);
  } catch (err) {
    console.error("Error showing background notification", err);
  }
});

// =====================================
// NOTIFICATION CLICK HANDLER
// =====================================
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  if (data && data.actionToken && (action === "YES" || action === "NO")) {
    const payload = {
      actionToken: data.actionToken,
      action
    };

    event.waitUntil(
      fetch("http://localhost:5002/api/match/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(() => {
          // Optional: open app after action
          return clients.openWindow("http://localhost:5173/dashboard");
        })
        .catch((err) =>
          console.error("Error posting notification response", err)
        )
    );
  } else {
    // If user clicks notification body instead of button
    event.waitUntil(
      clients.openWindow("http://localhost:5173/dashboard")
    );
  }
});

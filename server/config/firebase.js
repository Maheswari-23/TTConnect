import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

// 🔥 YOUR REAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAqPQySiO1OZl31oiMSq73SQLEoHvbPGJk",
  authDomain: "ttconnect-6d159.firebaseapp.com",
  projectId: "ttconnect-6d159",
  storageBucket: "ttconnect-6d159.firebasestorage.app",
  messagingSenderId: "1094557175374",
  appId: "1:1094557175374:web:a8ec882e0cbfb3c22cbd1f",
  measurementId: "G-YP9P46RZKX"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// ==========================================
// Request Notification Permission + Token
// ==========================================
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    console.log("Notification permission granted.");

    const token = await getToken(messaging, {
      vapidKey:
        "BJT_2JW9krQaDnub7JVbDWsy4sqtwkqjT7BdgFD2OcqnUTIwEZ4CrswRTZzJ4B4DJQ-JGFReJ41taTFGgYGPOEU"
    });

    console.log("FCM Token:", token);
    return token;

  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};

// ==========================================
// 🔥 FOREGROUND NOTIFICATION HANDLER
// ==========================================
onMessage(messaging, (payload) => {
  console.log("Foreground message received:", payload);

  if (Notification.permission === "granted") {
    new Notification(payload.notification?.title || "TTConnect", {
      body: payload.notification?.body || "New Match Available",
      icon: "/logo192.png"
    });
  }
});

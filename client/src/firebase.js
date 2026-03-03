// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase Messaging
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqPQySiO1OZl31oiMSq73SQLEoHvbPGJk",
  authDomain: "ttconnect-6d159.firebaseapp.com",
  projectId: "ttconnect-6d159",
  storageBucket: "ttconnect-6d159.firebasestorage.app",
  messagingSenderId: "1094557175374",
  appId: "1:1094557175374:web:a8ec882e0cbfb3c22cbd1f",
  measurementId: "G-YP9P46RZKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging
export const messaging = getMessaging(app);

// Function to request notification permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      const token = await getToken(messaging, {
        vapidKey: "BJT_2JW9krQaDnub7JVbDWsy4sqtwkqjT7BdgFD2OcqnUTIwEZ4CrswRTZzJ4B4DJQ-JGFReJ41taTFGgYGPOEU"
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("No registration token available.");
      }
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      resolve(payload);
    });
  });

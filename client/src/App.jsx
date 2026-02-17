import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { requestNotificationPermission } from "./firebase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {

  // 🔔 Request notification permission once when app loads
  useEffect(() => {
    (async () => {
      const token = await requestNotificationPermission();
      const authToken = localStorage.getItem("token");
      if (token && authToken) {
        try {
          await fetch("/api/users/save-fcm-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken
            },
            body: JSON.stringify({ token })
          });
        } catch (err) {
          console.error("Error saving FCM token", err);
        }
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { requestNotificationPermission } from "./firebase";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

/** Redirect logged-in users away from public pages → dashboard */
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

/** Redirect guests away from protected pages → login */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  useEffect(() => {
    (async () => {
      const fcmToken = await requestNotificationPermission();
      const authToken = localStorage.getItem("token");
      if (fcmToken && authToken) {
        try {
          await fetch("/api/auth/save-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ token: fcmToken }),
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
        {/* Public routes — logged-in users get redirected to /dashboard */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        {/* Protected route — guests get redirected to /login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { requestNotificationPermission } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Correct Login Route
      const { data } = await API.post("/api/auth/login", {
        email,
        password
      });

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);

      // Request FCM permission
      const fcmToken = await requestNotificationPermission();

      // ✅ Correct Save Token Route
      if (fcmToken) {
        await API.post(
          "/api/auth/save-token",
          { token: fcmToken },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
      }

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div
        className="card"
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          TTConnect Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ✅ Signup Link Added */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none"
};

export default Login;

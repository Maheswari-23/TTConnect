import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      // 1️⃣ Login API call
      const { data } = await API.post("/auth/login", {
        email,
        password
      });

      // 2️⃣ Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);

      // 3️⃣ Request FCM permission
      const fcmToken = await requestNotificationPermission();

      // 4️⃣ Save FCM token in backend
      if (fcmToken) {
        await API.post(
          "/auth/save-token",
          { token: fcmToken },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
      }

      // 5️⃣ Redirect to dashboard
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
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px"
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
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

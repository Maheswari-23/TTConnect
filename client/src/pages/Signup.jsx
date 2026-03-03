import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

/* ── Paddle Logo ── */
const PaddleLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="13" cy="13" r="11" fill="white" opacity="0.95" />
    <circle cx="13" cy="13" r="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
    <rect x="20" y="19" width="5" height="11" rx="2.5" fill="white" opacity="0.9"
      transform="rotate(-45 20 19)" />
    <circle cx="27" cy="5" r="3" fill="white" opacity="0.8" />
  </svg>
);

/* ── Inline SVG icons ── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("/api/auth/signup", { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.dotGrid} />

      <div style={S.card}>
        {/* Logo */}
        <Link to="/" style={S.logo}>
          <div style={S.logoBox}>
            <PaddleLogo size={20} />
          </div>
          <span style={S.logoName}>TTConnect</span>
        </Link>

        <div style={S.cardHead}>
          <h1 style={S.cardTitle}>Create your account</h1>
          <p style={S.cardSub}>Join TTConnect and start organizing matches</p>
        </div>

        {error && (
          <div style={S.errorBox}><IconAlert /> {error}</div>
        )}
        {success && (
          <div style={S.successBox}>
            <IconCheck />
            <div>
              <strong>Account created!</strong>
              <span style={{ display: "block", fontSize: "12px", marginTop: "2px" }}>Redirecting to sign in…</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSignup} style={S.form}>
          <div style={S.field}>
            <label style={S.label} htmlFor="signup-name">Full name</label>
            <div style={S.inputWrap}>
              <span style={S.inputIcon}><IconUser /></span>
              <input id="signup-name" type="text" style={S.input}
                placeholder="Your full name" value={name}
                onChange={(e) => setName(e.target.value)}
                required autoComplete="name"
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label} htmlFor="signup-email">Email address</label>
            <div style={S.inputWrap}>
              <span style={S.inputIcon}><IconMail /></span>
              <input id="signup-email" type="email" style={S.input}
                placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email"
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label} htmlFor="signup-password">Password</label>
            <div style={S.inputWrap}>
              <span style={S.inputIcon}><IconLock /></span>
              <input id="signup-password" type={showPw ? "text" : "password"}
                style={{ ...S.input, paddingRight: "44px" }}
                placeholder="Minimum 6 characters" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required minLength={6} autoComplete="new-password"
              />
              <button type="button" style={S.eyeBtn}
                onClick={() => setShowPw(v => !v)} aria-label="Toggle">
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <button id="signup-submit" type="submit" style={S.submitBtn}
            disabled={loading || success}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={S.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={S.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "24px",
    background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 40%, #ddd6fe 100%)",
    position: "relative", overflow: "hidden",
  },
  dotGrid: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(circle, #9333ea 1.2px, transparent 1.2px)",
    backgroundSize: "30px 30px", opacity: 0.18, pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1,
    background: "#fff", borderRadius: "20px",
    padding: "44px 48px", width: "100%", maxWidth: "460px",
    boxShadow: "0 20px 60px rgba(124,58,237,0.18), 0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  logo: {
    display: "flex", alignItems: "center", gap: "10px",
    marginBottom: "36px", textDecoration: "none",
  },
  logoBox: {
    width: "36px", height: "36px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    borderRadius: "10px", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  logoName: { fontSize: "18px", fontWeight: 800, color: "#1e1b2e" },

  cardHead: { marginBottom: "28px" },
  cardTitle: { fontSize: "26px", fontWeight: 800, color: "#1e1b2e", marginBottom: "6px" },
  cardSub: { fontSize: "14px", color: "#8b7fa8" },

  errorBox: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff5f5", border: "1px solid #fca5a5",
    color: "#dc2626", borderRadius: "10px",
    padding: "12px 14px", fontSize: "13px", fontWeight: 500, marginBottom: "20px",
  },
  successBox: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "#f0fdf4", border: "1px solid #86efac",
    color: "#166534", borderRadius: "10px",
    padding: "14px", fontSize: "14px", marginBottom: "20px",
  },

  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#4b4569" },

  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: "14px", color: "#9ca3af",
    display: "flex", alignItems: "center", pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "13px 14px 13px 42px",
    background: "#faf5ff", border: "1.5px solid #e8deff",
    borderRadius: "10px", color: "#1e1b2e",
    fontSize: "14px", fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  eyeBtn: {
    position: "absolute", right: "12px",
    background: "none", border: "none", cursor: "pointer",
    color: "#9ca3af", display: "flex", alignItems: "center", padding: "4px",
  },
  submitBtn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "15px", fontWeight: 700, fontFamily: "inherit",
    cursor: "pointer", marginTop: "6px",
    boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
    transition: "opacity 0.2s, transform 0.15s",
  },
  switchText: { textAlign: "center", fontSize: "13px", color: "#8b7fa8", marginTop: "24px" },
  switchLink: { color: "#7c3aed", fontWeight: 700, textDecoration: "none" },
};

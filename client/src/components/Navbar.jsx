import { useNavigate } from "react-router-dom";

/* ── Ping-Pong Paddle SVG Logo ── */
const PaddleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Paddle head */}
    <circle cx="13" cy="13" r="11" fill="white" opacity="0.95" />
    <circle cx="13" cy="13" r="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
    {/* Paddle handle */}
    <rect x="20" y="19" width="5" height="11" rx="2.5" fill="white" opacity="0.9"
      transform="rotate(-45 20 19)" />
    {/* Ball */}
    <circle cx="27" cy="5" r="3" fill="white" opacity="0.8" />
  </svg>
);

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Player";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={S.nav}>
      <div className="container" style={S.inner}>
        <div style={S.logo}>
          <div style={S.logoBox}>
            <PaddleLogo size={22} />
          </div>
          <span style={S.logoName}>TTConnect</span>
        </div>

        <div style={S.right}>
          <div style={S.userPill}>
            <div style={S.avatar}>{name.charAt(0).toUpperCase()}</div>
            <span style={S.userName}>{name}</span>
          </div>
          <button id="navbar-logout" onClick={handleLogout} style={S.logoutBtn}>
            <IconLogout /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const S = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid #f0ebff",
  },
  inner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: "64px",
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoBox: {
    width: "38px", height: "38px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    borderRadius: "11px", display: "flex",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 10px rgba(124,58,237,0.3)",
  },
  logoName: { fontSize: "17px", fontWeight: 800, color: "#1e1b2e" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  userPill: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#faf5ff", border: "1px solid #e8deff",
    borderRadius: "999px", padding: "5px 14px 5px 5px",
  },
  avatar: {
    width: "28px", height: "28px", borderRadius: "50%",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  userName: { fontSize: "13px", fontWeight: 600, color: "#1e1b2e" },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "#fff5f5", border: "1px solid #fca5a5",
    color: "#dc2626", padding: "8px 14px",
    borderRadius: "8px", fontSize: "13px", fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
};

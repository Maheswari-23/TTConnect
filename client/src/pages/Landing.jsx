import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ── Ping-Pong Paddle Logo ── */
const PaddleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="11" fill="white" opacity="0.95" />
    <circle cx="13" cy="13" r="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
    <rect x="20" y="19" width="5" height="11" rx="2.5" fill="white" opacity="0.9"
      transform="rotate(-45 20 19)" />
    <circle cx="27" cy="5" r="3" fill="white" opacity="0.8" />
  </svg>
);

/* ── SVG Icons (no emojis) ── */
const IconZap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconTrophy = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 21 16 21" /><line x1="12" y1="17" x2="12" y2="21" />
    <path d="M7 4h10l1 7a5 5 0 0 1-10 1.5A5 5 0 0 1 7 11z" />
    <path d="M7 4a2 2 0 0 0-2 2v.5a2.5 2.5 0 0 0 2.5 2.5" /><path d="M17 4a2 2 0 0 1 2 2v.5a2.5 2.5 0 0 1-2.5 2.5" />
  </svg>
);

const FEATURES = [
  { Icon: IconZap, title: "Real-time Updates", desc: "Instant notifications the moment a match starts, a player joins, or a spot opens up." },
  { Icon: IconTarget, title: "Smart Queue System", desc: "Full match? Join the queue. You'll be notified automatically when a slot becomes available." },
  { Icon: IconUsers, title: "Singles & Doubles", desc: "Create 1v1 or 2v2 matches in seconds. TTConnect handles the player management for you." },
];

const STATS = [
  { val: "100+", label: "Matches Organised" },
  { val: "50+", label: "Active Players" },
  { val: "< 1s", label: "Notification Speed" },
];

export default function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  return (
    <div style={S.page}>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={S.nav}>
        <div className="container" style={S.navInner}>
          <div style={S.logo}>
            <div style={S.logoBox}>
              <PaddleLogo size={22} />
            </div>
            <span style={S.logoName}>TTConnect</span>
          </div>
          <div style={S.navRight}>
            <Link to="/login">
              <button style={S.navGhost}>Sign In</button>
            </Link>
            <Link to="/signup">
              <button style={S.navCta}>Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.heroBlobL} />
        <div style={S.heroBlobR} />

        <div className="container" style={S.heroInner}>
          <div style={S.heroPill}>Table Tennis Match Manager</div>

          <h1 style={S.heroTitle}>
            Organise matches.<br />
            <span style={S.heroAccent}>Play more.</span>
          </h1>

          <p style={S.heroSub}>
            Schedule table tennis games in seconds. TTConnect handles real-time slots,
            automatic queues and instant push notifications — so you never miss a game.
          </p>

          <div style={S.heroCtas}>
            <Link to="/signup">
              <button style={S.heroBtn}>
                Get Started Free <IconArrow />
              </button>
            </Link>
            <Link to="/login">
              <button style={S.heroSecBtn}>Sign In</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────── */}
      <div style={S.statsBar}>
        <div className="container" style={S.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label} style={S.statItem}>
              <div style={S.statVal}>{s.val}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ───────────────────────────────── */}
      <section style={S.features}>
        <div className="container">
          <div style={S.secHead}>
            <span style={S.secTag}>WHY TTCONNECT</span>
            <h2 style={S.secTitle}>Built for real players</h2>
            <p style={S.secSub}>Everything your table tennis community needs, nothing it doesn't.</p>
          </div>

          <div style={S.featGrid}>
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="card" style={S.featCard}>
                <div style={S.featIconBox}>
                  <Icon />
                </div>
                <h3 style={S.featTitle}>{title}</h3>
                <p style={S.featDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────── */}
      <section style={S.howSection}>
        <div className="container">
          <div style={S.secHead}>
            <span style={S.secTag}>HOW IT WORKS</span>
            <h2 style={S.secTitle}>Three steps to your next match</h2>
          </div>
          <div style={S.stepsRow}>
            {[
              {
                n: "01", title: "Sign up",
                desc: "Create your account in seconds and enable push notifications.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                n: "02", title: "Create a match",
                desc: "Choose Singles or Doubles, pick a time and create your match.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
                  </svg>
                ),
              },
              {
                n: "03", title: "Play",
                desc: "Everyone gets notified instantly. Show up and play.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                ),
              },
            ].map((step, i, arr) => (
              <React.Fragment key={step.n}>
                <div style={S.stepCard}>
                  <div style={S.stepIconBox}>{step.icon}</div>
                  <div style={S.stepBadge}>{step.n}</div>
                  <h3 style={S.stepTitle}>{step.title}</h3>
                  <p style={S.stepDesc}>{step.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div style={S.stepArrow}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section style={S.cta}>
        <div style={S.ctaDotGrid} />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={S.ctaTitle}>Ready to hit the table?</h2>
          <p style={S.ctaSub}>Sign up free and start organising matches today.</p>
          <Link to="/signup">
            <button style={S.ctaBtn}>Create Your Free Account</button>
          </Link>
        </div>
      </section>

    </div>
  );
}

/* ── STYLES ─────────────────────────────────────────── */
const S = {
  page: { background: "#fff", overflowX: "hidden" },

  /* Navbar */
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
    borderBottom: "1px solid #f0ebff", padding: "0",
    height: "64px",
  },
  navInner: {
    height: "64px", display: "flex",
    alignItems: "center", justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoBox: {
    width: "36px", height: "36px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
    borderRadius: "10px", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  logoName: { fontSize: "18px", fontWeight: 800, color: "#1e1b2e" },
  navRight: { display: "flex", gap: "8px", alignItems: "center" },
  navGhost: {
    background: "none", border: "none", fontFamily: "inherit",
    fontSize: "14px", fontWeight: 600, color: "#4b4569",
    padding: "10px 18px", borderRadius: "8px", cursor: "pointer",
    transition: "color 0.2s, background 0.2s",
  },
  navCta: {
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    border: "none", fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
    padding: "10px 22px", borderRadius: "8px", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
  },

  /* Hero */
  hero: {
    paddingTop: "130px", paddingBottom: "100px",
    background: "linear-gradient(160deg,#fff 55%,#faf5ff 100%)",
    position: "relative", overflow: "hidden",
  },
  heroBlobL: {
    position: "absolute", top: "-60px", left: "-80px",
    width: "420px", height: "420px", borderRadius: "50%",
    background: "radial-gradient(circle,#e9d5ff 0%,transparent 70%)",
    filter: "blur(40px)", opacity: 0.7, pointerEvents: "none",
  },
  heroBlobR: {
    position: "absolute", bottom: "-80px", right: "-60px",
    width: "380px", height: "380px", borderRadius: "50%",
    background: "radial-gradient(circle,#ddd6fe 0%,transparent 70%)",
    filter: "blur(40px)", opacity: 0.6, pointerEvents: "none",
  },
  heroInner: { textAlign: "center", maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 1 },
  heroPill: {
    display: "inline-block",
    background: "#f3e8ff", color: "#7c3aed",
    border: "1px solid #ddd6fe", borderRadius: "999px",
    padding: "7px 20px", fontSize: "13px", fontWeight: 600,
    marginBottom: "32px",
  },
  heroTitle: {
    fontSize: "clamp(52px, 7vw, 88px)",
    fontWeight: 900, lineHeight: 1.05,
    letterSpacing: "-0.04em", color: "#1e1b2e",
    marginBottom: "28px",
  },
  heroAccent: { color: "#7c3aed" },
  heroSub: {
    fontSize: "18px", color: "#4b4569", lineHeight: 1.8,
    maxWidth: "580px", margin: "0 auto 44px",
  },
  heroCtas: { display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" },
  heroBtn: {
    display: "inline-flex", alignItems: "center", gap: "10px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    border: "none", fontFamily: "inherit", fontSize: "16px", fontWeight: 700,
    padding: "16px 34px", borderRadius: "12px", cursor: "pointer",
    boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
    transition: "transform 0.15s, box-shadow 0.2s",
  },
  heroSecBtn: {
    background: "none", border: "1.5px solid #d8b4fe", color: "#7c3aed",
    fontFamily: "inherit", fontSize: "16px", fontWeight: 600,
    padding: "15px 30px", borderRadius: "12px", cursor: "pointer",
    transition: "background 0.2s",
  },

  /* Stats bar */
  statsBar: {
    borderTop: "1px solid #f0ebff", borderBottom: "1px solid #f0ebff",
    background: "#faf5ff", padding: "44px 0",
  },
  statsGrid: {
    display: "flex", justifyContent: "center",
    gap: "80px", flexWrap: "wrap",
  },
  statItem: { textAlign: "center" },
  statVal: { fontSize: "44px", fontWeight: 900, color: "#7c3aed", lineHeight: 1 },
  statLabel: { fontSize: "14px", color: "#8b7fa8", fontWeight: 500, marginTop: "6px" },

  /* Features */
  features: { padding: "100px 0", background: "#fff" },
  secHead: { textAlign: "center", marginBottom: "60px" },
  secTag: {
    display: "inline-block", fontSize: "11px", fontWeight: 700,
    letterSpacing: "0.14em", color: "#7c3aed", marginBottom: "14px",
  },
  secTitle: { fontSize: "38px", fontWeight: 800, color: "#1e1b2e", marginBottom: "12px" },
  secSub: { fontSize: "16px", color: "#4b4569", maxWidth: "460px", margin: "0 auto" },

  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" },
  featCard: { padding: "34px", display: "flex", flexDirection: "column", gap: "16px" },
  featIconBox: {
    width: "52px", height: "52px", background: "#f3e8ff",
    borderRadius: "14px", display: "flex",
    alignItems: "center", justifyContent: "center", color: "#7c3aed",
  },
  featTitle: { fontSize: "19px", fontWeight: 700, color: "#1e1b2e" },
  featDesc: { fontSize: "14px", color: "#4b4569", lineHeight: 1.75 },

  /* How it works */
  howSection: { padding: "100px 0", background: "#fff" },
  stepsRow: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "0", marginTop: "56px", flexWrap: "wrap",
  },
  stepCard: {
    background: "#fff", border: "1px solid #ede9fe",
    borderRadius: "18px", padding: "32px 28px",
    textAlign: "center", flex: "1", minWidth: "200px", maxWidth: "260px",
    boxShadow: "0 4px 20px rgba(124,58,237,0.08), 0 1px 4px rgba(0,0,0,0.04)",
    position: "relative", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "12px",
  },
  stepIconBox: {
    width: "62px", height: "62px", background: "#f3e8ff",
    borderRadius: "16px", display: "flex",
    alignItems: "center", justifyContent: "center", marginBottom: "4px",
  },
  stepBadge: {
    position: "absolute", top: "-12px", left: "-12px",
    width: "32px", height: "32px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    borderRadius: "50%", fontSize: "11px", fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 3px 8px rgba(124,58,237,0.4)",
  },
  stepArrow: {
    flexShrink: 0, padding: "0 4px", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  stepTitle: { fontSize: "16px", fontWeight: 700, color: "#1e1b2e" },
  stepDesc: { fontSize: "13px", color: "#6b7280", lineHeight: 1.65 },

  /* CTA */
  cta: {
    padding: "110px 0", position: "relative", overflow: "hidden",
    background: "linear-gradient(135deg,#f3e8ff 0%,#e9d5ff 40%,#ddd6fe 100%)",
  },
  ctaDotGrid: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, #9333ea 1.2px, transparent 1.2px)",
    backgroundSize: "28px 28px", opacity: 0.15,
  },
  ctaTitle: { fontSize: "42px", fontWeight: 900, color: "#1e1b2e", marginBottom: "14px" },
  ctaSub: { fontSize: "16px", color: "#6b7280", marginBottom: "36px" },
  ctaBtn: {
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    border: "none", fontFamily: "inherit", fontSize: "16px", fontWeight: 700,
    padding: "17px 40px", borderRadius: "12px", cursor: "pointer",
    boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
    transition: "transform 0.15s",
  },

  /* Footer */
  footer: { padding: "28px 0", borderTop: "1px solid #f0ebff", background: "#fff" },
  footerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" },
};

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MatchCard from "../components/MatchCard";
import CreateMatchModal from "../components/CreateMatchModal";
import API from "../api/axios";
import socket from "../socket";

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name") || "Player";
  const userId = localStorage.getItem("userId");

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/api/match", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(data.filter((m) => m.status !== "COMPLETED"));
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchMatches();
    socket.on("matchUpdated", fetchMatches);
    return () => socket.off("matchUpdated");
  }, []);

  // Derived stats
  const activeMatches = matches.filter((m) => m.status === "WAITING" || m.status === "FULL");
  const myPlaying = matches.filter((m) => m.players.some((p) => p._id === userId));
  const myQueue = matches.filter((m) => m.queue.some((q) => q._id === userId));
  const liveNow = matches.filter((m) => m.status === "ONGOING");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={S.page}>
      <Navbar />

      {/* ── Header band ─────────────────── */}
      <div style={S.headerBand}>
        <div className="container" style={S.headerInner}>
          <div>
            <p style={S.greeting}>{greeting}</p>
            <h1 style={S.nameTitle}>{name.split(" ")[0]}</h1>
          </div>
          <button id="create-match-btn" style={S.createBtn} onClick={() => setShowModal(true)}>
            <IconPlus /> Create Match
          </button>
        </div>
      </div>

      <main style={S.main}>
        <div className="container">

          {/* ── Stats strip ─────────────── */}
          <div style={S.statsRow}>
            <StatCard label="Active Matches" value={activeMatches.length} bg="#f3e8ff" border="#ddd6fe" color="#7c3aed" />
            <StatCard label="You're Playing" value={myPlaying.length} bg="#f0fdf4" border="#bbf7d0" color="#059669" />
            <StatCard label="In Your Queue" value={myQueue.length} bg="#fffbeb" border="#fde68a" color="#d97706" />
            <StatCard label="Live Now" value={liveNow.length} bg="#fef2f2" border="#fca5a5" color="#dc2626" />
          </div>

          {/* ── My Queue section ────────── */}
          {myQueue.length > 0 && (
            <div style={S.queueSection}>
              <div style={S.sectionRow}>
                <div style={S.sectionIcon}><IconList /></div>
                <h2 style={S.sectionTitle}>Your Queue Positions</h2>
                <div style={S.countPill}>{myQueue.length} match{myQueue.length !== 1 ? "es" : ""}</div>
              </div>
              <div style={S.queueList}>
                {myQueue.map((match) => {
                  const pos = match.queue.findIndex((q) => q._id === userId) + 1;
                  return (
                    <div key={match._id} style={S.queueItem}>
                      <div style={S.queueLeft}>
                        <div style={S.queuePos}>#{pos}</div>
                        <div>
                          <div style={S.queueMatchMode}>{match.mode} match</div>
                          <div style={S.queueMatchTime}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#8b7fa8" }}>
                              <IconClock />
                              {new Date(match.startTime).toLocaleString("en-IN", {
                                weekday: "short", hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={S.queueRight}>
                        <span style={S.queuePlayersTag}>
                          <IconUsers />
                          {match.players.length}/{match.playerLimit}
                        </span>
                        <span style={{ fontSize: "11px", color: "#8b7fa8", fontWeight: 500 }}>
                          {match.queue.length} in queue
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Upcoming matches ────────── */}
          <div style={S.sectionRow}>
            <h2 style={S.sectionTitle}>Upcoming Matches</h2>
            <div style={S.countPill}>{matches.length} total</div>
          </div>

          {loading ? (
            <div style={S.emptyBox}>
              <div style={S.emptySpinner} />
              <p style={{ color: "#8b7fa8", fontWeight: 500, marginTop: "16px" }}>Loading matches…</p>
            </div>
          ) : matches.length === 0 ? (
            <div style={S.emptyBox}>
              <div style={S.emptyIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3 style={S.emptyTitle}>No matches yet</h3>
              <p style={S.emptySub}>Create the first match and invite others to join!</p>
              <button style={{ ...S.createBtn, marginTop: "24px" }} onClick={() => setShowModal(true)}>
                <IconPlus /> Create First Match
              </button>
            </div>
          ) : (
            <div style={S.grid}>
              {matches.map((match) => (
                <MatchCard key={match._id} match={match} refresh={fetchMatches} />
              ))}
            </div>
          )}

        </div>
      </main>

      {showModal && (
        <CreateMatchModal close={() => { setShowModal(false); fetchMatches(); }} />
      )}
    </div>
  );
}

function StatCard({ label, value, bg, border, color }) {
  return (
    <div style={{ ...S.statCard, background: bg, border: `1px solid ${border}` }}>
      <div style={{ ...S.statVal, color }}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", background: "#f8f6ff" },
  headerBand: { background: "#fff", borderBottom: "1px solid #f0ebff", padding: "28px 0" },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  greeting: { fontSize: "13px", color: "#8b7fa8", fontWeight: 500, marginBottom: "2px" },
  nameTitle: { fontSize: "26px", fontWeight: 800, color: "#1e1b2e" },

  createBtn: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    border: "none", fontFamily: "inherit", fontSize: "14px", fontWeight: 700,
    padding: "12px 22px", borderRadius: "10px", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
  },

  main: { padding: "36px 0 80px" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px", marginBottom: "32px" },
  statCard: { borderRadius: "14px", padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  statVal: { fontSize: "34px", fontWeight: 900, lineHeight: 1 },
  statLabel: { fontSize: "12px", color: "#8b7fa8", marginTop: "5px", fontWeight: 500 },

  /* Queue section */
  queueSection: {
    marginBottom: "32px", background: "#fff",
    border: "1px solid #f0ebff", borderRadius: "16px",
    padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  queueList: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" },
  queueItem: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#faf5ff", borderRadius: "10px",
    padding: "12px 16px", border: "1px solid #f0ebff",
  },
  queueLeft: { display: "flex", alignItems: "center", gap: "14px" },
  queueRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" },
  queuePos: {
    width: "34px", height: "34px", borderRadius: "8px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 800, flexShrink: 0,
  },
  queueMatchMode: { fontSize: "13px", fontWeight: 700, color: "#1e1b2e", textTransform: "capitalize" },
  queueMatchTime: { fontSize: "12px", marginTop: "2px" },
  queuePlayersTag: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    background: "#f3e8ff", border: "1px solid #e8deff",
    color: "#7c3aed", padding: "3px 8px", borderRadius: "6px",
    fontSize: "12px", fontWeight: 600,
  },

  sectionRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" },
  sectionIcon: { color: "#7c3aed", display: "flex", alignItems: "center" },
  sectionTitle: { fontSize: "18px", fontWeight: 700, color: "#1e1b2e" },
  countPill: {
    background: "#fff", border: "1px solid #e8deff",
    color: "#8b7fa8", fontSize: "12px", fontWeight: 600,
    padding: "3px 12px", borderRadius: "999px",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" },

  emptyBox: {
    background: "#fff", border: "1px solid #f0ebff", borderRadius: "18px",
    padding: "80px 40px", textAlign: "center",
  },
  emptyIcon: {
    width: "72px", height: "72px", borderRadius: "20px",
    background: "#f3e8ff", display: "flex", alignItems: "center",
    justifyContent: "center", margin: "0 auto 20px",
  },
  emptySpinner: {
    width: "36px", height: "36px", border: "3px solid #f0ebff",
    borderTop: "3px solid #7c3aed", borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 0.9s linear infinite",
  },
  emptyTitle: { fontSize: "20px", fontWeight: 700, color: "#1e1b2e", marginBottom: "8px" },
  emptySub: { fontSize: "14px", color: "#8b7fa8", maxWidth: "280px", margin: "0 auto" },
};

import { useState } from "react";
import API from "../api/axios";

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function CreateMatchModal({ close }) {
  const [mode, setMode] = useState("SINGLES");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!startTime) { setError("Please select a start time."); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const now = new Date();
      const selectedTime = new Date(`${now.toDateString()} ${startTime}`);
      await API.post("/api/match",
        { mode, startTime: selectedTime.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      close();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create match.");
    } finally { setLoading(false); }
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <div style={S.modal}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h2 style={S.title}>Create a Match</h2>
            <p style={S.sub}>Set up a new table tennis game for today</p>
          </div>
          <button id="modal-close" onClick={close} style={S.closeBtn} aria-label="Close">
            <IconX />
          </button>
        </div>

        {error && (
          <div style={S.errorBox}>{error}</div>
        )}

        <form onSubmit={handleCreate} style={S.form}>
          {/* Mode */}
          <div style={S.field}>
            <label style={S.label}>Match type</label>
            <div style={S.modeGrid}>
              {[
                { val: "SINGLES", Icon: IconUser, title: "Singles", desc: "1 vs 1  ·  2 players" },
                { val: "DOUBLES", Icon: IconUsers, title: "Doubles", desc: "2 vs 2  ·  4 players" },
              ].map(({ val, Icon, title, desc }) => (
                <button key={val} type="button"
                  onClick={() => setMode(val)}
                  style={{ ...S.modeCard, ...(mode === val ? S.modeActive : {}) }}>
                  <div style={{ ...S.modeIcon, background: mode === val ? "#ede9fe" : "#f9fafb", color: mode === val ? "#7c3aed" : "#9ca3af" }}>
                    <Icon />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "#1e1b2e" }}>{title}</span>
                  <span style={{ fontSize: "12px", color: "#8b7fa8" }}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div style={S.field}>
            <label style={S.label} htmlFor="match-time">Start time (today)</label>
            <input id="match-time" type="time" style={S.timeInput}
              value={startTime} onChange={(e) => setStartTime(e.target.value)} required
            />
          </div>

          {/* Buttons */}
          <div style={S.btnRow}>
            <button type="button" onClick={close} style={S.cancelBtn}>Cancel</button>
            <button id="modal-create" type="submit" style={S.createBtn} disabled={loading}>
              {loading ? "Creating…" : "Create Match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(109,40,217,0.14)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
  },
  modal: {
    background: "#fff", borderRadius: "20px", padding: "32px",
    width: "100%", maxWidth: "440px",
    boxShadow: "0 24px 60px rgba(124,58,237,0.18)",
    border: "1px solid #f0ebff",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title: { fontSize: "20px", fontWeight: 800, color: "#1e1b2e" },
  sub: { fontSize: "13px", color: "#8b7fa8", marginTop: "3px" },
  closeBtn: {
    width: "32px", height: "32px", background: "#f9fafb",
    border: "1px solid #e5e7eb", color: "#6b7280",
    borderRadius: "50%", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", fontFamily: "inherit",
    flexShrink: 0,
  },

  errorBox: {
    background: "#fff5f5", border: "1px solid #fca5a5",
    color: "#dc2626", borderRadius: "10px",
    padding: "12px 14px", fontSize: "13px", fontWeight: 500, marginBottom: "20px",
  },

  form: { display: "flex", flexDirection: "column", gap: "22px" },
  field: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#4b4569" },

  modeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  modeCard: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "7px",
    padding: "18px 12px", borderRadius: "12px",
    background: "#fff", border: "1.5px solid #e8deff",
    cursor: "pointer", fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  modeActive: {
    borderColor: "#7c3aed",
    boxShadow: "0 0 0 4px rgba(124,58,237,0.1)",
  },
  modeIcon: {
    width: "44px", height: "44px", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s, color 0.2s",
  },
  timeInput: {
    width: "100%", padding: "13px 16px",
    background: "#faf5ff", border: "1.5px solid #e8deff",
    borderRadius: "10px", color: "#1e1b2e",
    fontSize: "14px", fontFamily: "inherit", outline: "none",
  },

  btnRow: { display: "flex", gap: "12px" },
  cancelBtn: {
    flex: 1, padding: "13px", background: "#f9fafb",
    border: "1px solid #e5e7eb", color: "#4b4569",
    fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
    borderRadius: "10px", cursor: "pointer",
  },
  createBtn: {
    flex: 2, padding: "13px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    border: "none", fontFamily: "inherit", fontSize: "14px", fontWeight: 700,
    borderRadius: "10px", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
  },
};

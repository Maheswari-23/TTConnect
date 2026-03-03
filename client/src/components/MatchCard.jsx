import API from "../api/axios";

/* ── SVG Icons ── */
const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconList = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconLock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconActivity = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// Server enum: WAITING | FULL | ONGOING | COMPLETED
const MODE_META = {
  SINGLES: { label: "Singles", cls: "badge-violet" },
  DOUBLES: { label: "Doubles", cls: "badge-blue" },
};
const STATUS_META = {
  WAITING: { label: "Open", cls: "badge-purple" },
  FULL: { label: "Full", cls: "badge-amber" },
  ONGOING: { label: "Live", cls: "badge-green" },
  COMPLETED: { label: "Completed", cls: "badge-gray" },
};

export default function MatchCard({ match, refresh }) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const isCreator = match.creator?._id === currentUserId;
  const isJoined = match.players.some((p) => p._id === currentUserId);
  const isInQueue = match.queue.some((q) => q._id === currentUserId);
  const isFull = match.players.length >= match.playerLimit;
  const pct = match.players.length / match.playerLimit;
  const isActive = match.status === "WAITING" || match.status === "FULL";

  const mode = MODE_META[match.mode] || MODE_META.SINGLES;
  const status = STATUS_META[match.status] || STATUS_META.WAITING;

  const handleJoin = async () => {
    try { await API.post(`/api/match/join/${match._id}`, {}, { headers: { Authorization: `Bearer ${token}` } }); refresh(); }
    catch (e) { console.error(e); }
  };
  const handleCancel = async () => {
    try { await API.post(`/api/match/cancel/${match._id}`, {}, { headers: { Authorization: `Bearer ${token}` } }); refresh(); }
    catch (e) { console.error(e); }
  };

  return (
    <div style={S.card}>
      {/* Colored top accent line */}
      <div style={{
        ...S.accentLine,
        background: match.mode === "DOUBLES"
          ? "linear-gradient(90deg,#2563eb,#7c3aed)"
          : "linear-gradient(90deg,#7c3aed,#a855f7)",
      }} />

      <div style={S.body}>
        {/* Badges */}
        <div style={S.badges}>
          <span className={`badge ${mode.cls}`}>{mode.label}</span>
          <span className={`badge ${status.cls}`}>{status.label}</span>
          {isCreator && <span className="badge badge-amber" style={{ marginLeft: "auto" }}>Your match</span>}
        </div>

        {/* Info rows */}
        <div style={S.infoList}>
          <Info Icon={IconUser} text={`Created by ${match.creator?.name}`} />
          <Info Icon={IconClock} text={new Date(match.startTime).toLocaleString("en-IN", {
            weekday: "short", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })} />
          <Info Icon={IconUsers} text={`${match.players.length}/${match.playerLimit} players${match.players.length > 0 ? ` — ${match.players.map(p => p.name).join(", ")}` : ""}`} />
          {match.queue.length > 0 && (
            <Info Icon={IconList} text={`Queue (${match.queue.length}): ${match.queue.map(q => q.name).join(", ")}`} />
          )}
        </div>

        {/* Capacity bar */}
        <div>
          <div style={S.barTrack}>
            <div style={{
              ...S.barFill,
              width: `${Math.min(pct * 100, 100)}%`,
              background: pct >= 1 ? "#ef4444" : "linear-gradient(90deg,#7c3aed,#a855f7)",
            }} />
          </div>
          <div style={S.barMeta}>
            <span>{match.players.length} of {match.playerLimit} filled</span>
            <span style={{ color: pct >= 1 ? "#dc2626" : "#7c3aed", fontWeight: 600 }}>
              {pct >= 1 ? "Full" : `${match.playerLimit - match.players.length} spot${match.playerLimit - match.players.length !== 1 ? "s" : ""} open`}
            </span>
          </div>
        </div>

        {/* Queue position chip */}
        {isInQueue && !isJoined && (
          <div style={S.queueChip}>
            Position #{match.queue.findIndex(q => q._id === currentUserId) + 1} in queue
          </div>
        )}

        {/* Actions */}
        <div style={S.actions}>
          {match.status === "ONGOING" && (
            <div style={S.liveChip}><IconActivity /> Match is live now</div>
          )}
          {match.status === "COMPLETED" && (
            <div style={S.doneChip}>Match completed</div>
          )}

          {isActive && (
            <>
              {isJoined && (
                <button style={S.btnCancel} onClick={handleCancel}>
                  <IconX /> Cancel Spot
                </button>
              )}
              {isInQueue && !isJoined && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button style={S.btnQueue} onClick={handleCancel}>
                    <IconX /> Leave Queue
                  </button>
                </div>
              )}
              {!isJoined && !isInQueue && !isFull && (
                <button style={S.btnJoin} onClick={handleJoin}>
                  <IconCheck /> Join Match
                </button>
              )}
              {!isJoined && !isInQueue && isFull && (
                <button style={S.btnJoinQueue} onClick={handleJoin}>
                  Join Waiting Queue
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ Icon, text }) {
  return (
    <div style={S.infoRow}>
      <span style={S.infoIcon}><Icon /></span>
      <span style={S.infoText}>{text}</span>
    </div>
  );
}

const S = {
  card: {
    background: "#fff", borderRadius: "14px",
    border: "1px solid #f0ebff", overflow: "hidden",
    boxShadow: "0 2px 12px rgba(124,58,237,0.08), 0 1px 3px rgba(0,0,0,0.04)",
    display: "flex", flexDirection: "column",
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  accentLine: { height: "3px", flexShrink: 0 },
  body: { padding: "20px", display: "flex", flexDirection: "column", gap: "14px" },

  badges: { display: "flex", flexWrap: "wrap", gap: "6px" },

  infoList: { display: "flex", flexDirection: "column", gap: "7px" },
  infoRow: { display: "flex", gap: "8px", alignItems: "flex-start" },
  infoIcon: { color: "#a78bfa", marginTop: "1px", flexShrink: 0 },
  infoText: { fontSize: "13px", color: "#4b4569", lineHeight: 1.5 },

  barTrack: { height: "5px", background: "#f3e8ff", borderRadius: "99px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "99px", transition: "width 0.4s" },
  barMeta: {
    display: "flex", justifyContent: "space-between",
    fontSize: "12px", color: "#8b7fa8", fontWeight: 500, marginTop: "5px",
  },

  queueChip: {
    textAlign: "center", padding: "8px 12px",
    background: "#fffbeb", border: "1px solid #fde68a",
    color: "#92400e", borderRadius: "8px",
    fontSize: "12px", fontWeight: 700,
  },

  actions: {},
  btnJoin: {
    width: "100%", padding: "12px", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
    border: "none", fontFamily: "inherit", fontSize: "14px", fontWeight: 700,
    borderRadius: "10px", cursor: "pointer",
    boxShadow: "0 3px 10px rgba(124,58,237,0.3)",
  },
  btnJoinQueue: {
    width: "100%", padding: "12px",
    background: "#faf5ff", border: "1.5px solid #ddd6fe",
    color: "#7c3aed", fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
    borderRadius: "10px", cursor: "pointer",
  },
  btnCancel: {
    width: "100%", padding: "11px", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    background: "#fff5f5", border: "1.5px solid #fca5a5",
    color: "#dc2626", fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
    borderRadius: "10px", cursor: "pointer",
  },
  btnQueue: {
    width: "100%", padding: "10px", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    background: "transparent", border: "1.5px solid #fca5a5",
    color: "#dc2626", fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
    borderRadius: "10px", cursor: "pointer",
  },
  liveChip: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#f0fdf4", border: "1px solid #86efac", color: "#166534",
    borderRadius: "10px", padding: "11px",
    fontSize: "13px", fontWeight: 600,
  },
  doneChip: {
    textAlign: "center", padding: "10px",
    background: "#f9fafb", border: "1px solid #e5e7eb",
    color: "#9ca3af", borderRadius: "10px",
    fontSize: "13px", fontWeight: 600,
  },
};

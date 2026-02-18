import API from "../api/axios";

function MatchCard({ match, refresh }) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const isCreator = match.creator?._id === currentUserId;
  const isJoined = match.players.some((p) => p._id === currentUserId);
  const isInQueue = match.queue.some((q) => q._id === currentUserId);
  const isFull = match.players.length >= match.playerLimit;

  const handleJoin = async () => {
    try {
      await API.post(
        `/api/match/join/${match._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      refresh();
    } catch (error) {
      console.error("Join failed:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await API.post(
        `/api/match/cancel/${match._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      refresh();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case "WAITING":
        return "#f59e0b";
      case "FULL":
        return "#3b82f6";
      case "ONGOING":
        return "#22c55e";
      case "COMPLETED":
        return "#6b7280";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0 }}>{match.mode}</h3>
        <span
          style={{
            ...statusBadge,
            backgroundColor: getStatusColor()
          }}
        >
          {match.status}
        </span>
      </div>

      {/* Creator */}
      <p style={textStyle}>
        👤 <strong>{match.creator?.name}</strong>
      </p>

      {/* Start Time */}
      <p style={textStyle}>
        🕒 {new Date(match.startTime).toLocaleString()}
      </p>

      {/* Players */}
      <div style={{ marginTop: "12px" }}>
        <strong>
          Players ({match.players.length}/{match.playerLimit})
        </strong>

        <div style={tagContainer}>
          {match.players.length > 0 ? (
            match.players.map((p) => (
              <span key={p._id} style={tagStyle}>
                {p.name}
              </span>
            ))
          ) : (
            <span style={emptyStyle}>None</span>
          )}
        </div>
      </div>

      {/* Queue */}
      <div style={{ marginTop: "10px" }}>
        <strong>Queue</strong>
        <div style={tagContainer}>
          {match.queue.length > 0 ? (
            match.queue.map((q) => (
              <span key={q._id} style={queueTagStyle}>
                {q.name}
              </span>
            ))
          ) : (
            <span style={emptyStyle}>Empty</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      {match.status !== "COMPLETED" &&
        match.status !== "ONGOING" && (
          <div style={{ marginTop: "16px" }}>
            {!isJoined && !isInQueue && !isFull && (
              <button
                style={primaryButton}
                onClick={handleJoin}
              >
                Join Match
              </button>
            )}

            {isJoined && (
              <button
                style={outlineButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            {isFull && !isJoined && (
              <button style={disabledButton} disabled>
                Full
              </button>
            )}
          </div>
        )}

      {match.status === "ONGOING" && (
        <p style={ongoingText}>
          🔥 Match in progress
        </p>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
};

const statusBadge = {
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold"
};

const textStyle = {
  margin: "6px 0",
  color: "#374151"
};

const tagContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "8px"
};

const tagStyle = {
  background: "#e0f2fe",
  color: "#0369a1",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "13px"
};

const queueTagStyle = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "13px"
};

const emptyStyle = {
  color: "#9ca3af",
  fontStyle: "italic"
};

const primaryButton = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold"
};

const outlineButton = {
  background: "#fff",
  color: "#ef4444",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid #ef4444",
  cursor: "pointer",
  width: "100%",
  fontWeight: "bold"
};

const disabledButton = {
  background: "#e5e7eb",
  color: "#6b7280",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  width: "100%",
  fontWeight: "bold"
};

const ongoingText = {
  marginTop: "14px",
  color: "#16a34a",
  fontWeight: "bold"
};

export default MatchCard;

import API from "../api/axios";

function MatchCard({ match, refresh }) {

  const currentUserId = localStorage.getItem("userId");

  const isCreator = match.creator?._id === currentUserId;
  const isJoined = match.players.some(p => p._id === currentUserId);
  const isInQueue = match.queue.some(q => q._id === currentUserId);
  const isFull = match.players.length >= match.playerLimit;

  const handleJoin = async () => {
    await API.post(
      `/match/join/${match._id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    refresh();
  };

  const handleCancel = async () => {
    await API.post(
      `/match/cancel/${match._id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    refresh();
  };

  return (
    <div className="card">

      <h3>{match.mode}</h3>

      <p><strong>Created by:</strong> {match.creator?.name}</p>

      <p><strong>Start:</strong> {new Date(match.startTime).toLocaleString()}</p>

      <p><strong>Status:</strong> {match.status}</p>

      <p>
        <strong>Players ({match.players.length}/{match.playerLimit}):</strong>{" "}
        {match.players.map(p => p.name).join(", ") || "None"}
      </p>

      <p>
        <strong>Queue:</strong>{" "}
        {match.queue.map(q => q.name).join(", ") || "Empty"}
      </p>

      {/* BUTTON LOGIC */}

      {match.status !== "COMPLETED" && match.status !== "ONGOING" && (
        <>
          {!isJoined && !isInQueue && !isFull && (
            <button className="btn-primary" onClick={handleJoin}>
              Join
            </button>
          )}

          {isJoined && (
            <button className="btn-outline" onClick={handleCancel}>
              Cancel
            </button>
          )}

          {isFull && !isJoined && (
            <button disabled className="btn-disabled">
              Full
            </button>
          )}
        </>
      )}

      {match.status === "ONGOING" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Match in progress 🔥
        </p>
      )}

    </div>
  );
}

export default MatchCard;

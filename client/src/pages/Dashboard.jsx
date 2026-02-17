import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MatchCard from "../components/MatchCard";
import CreateMatchModal from "../components/CreateMatchModal";
import API from "../api/axios";
import socket from "../socket";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/api/match", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMatches(data.filter((m) => m.status !== "COMPLETED"));
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMatches();

    // Listen for realtime updates
    socket.on("matchUpdated", () => {
      fetchMatches();
    });

    return () => {
      socket.off("matchUpdated");
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Upcoming Matches</h2>

          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Create Match
          </button>
        </div>

        <div style={{ marginTop: "20px", display: "grid", gap: "20px" }}>
          {matches.length === 0 ? (
            <p>No matches available</p>
          ) : (
            matches.map((match) => (
              <MatchCard
                key={match._id}
                match={match}
                refresh={fetchMatches}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateMatchModal
          close={() => {
            setShowModal(false);
            fetchMatches();
          }}
        />
      )}
    </>
  );
}

export default Dashboard;

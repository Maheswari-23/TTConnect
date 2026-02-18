import { useState } from "react";
import API from "../api/axios";

function CreateMatchModal({ close }) {
  const [mode, setMode] = useState("SINGLES");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  const handleCreate = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ Prevent double click
    setLoading(true);

    if (!startTime) {
      alert("Please select time");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const now = new Date();
      const selectedTime = new Date(
        `${now.toDateString()} ${startTime}`
      );

      await API.post(
        "/api/match",
        {
          mode,
          startTime: selectedTime.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Match created successfully 🏓");
      close();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to create match"
      );
    } finally {
      setLoading(false); // ✅ Reset loading
    }
  };

  return (
    <div style={overlayStyle}>
      <div className="card" style={{ width: "400px" }}>
        <h3>Create Match</h3>

        <form onSubmit={handleCreate}>
          <select
            value={mode}
            onChange={(e) =>
              setMode(
                e.target.value === "Singles (2 Players)"
                  ? "SINGLES"
                  : "DOUBLES"
              )
            }
            style={inputStyle}
            disabled={loading} // ✅ Disable while loading
          >
            <option>Singles (2 Players)</option>
            <option>Doubles (4 Players)</option>
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            style={inputStyle}
            disabled={loading} // ✅ Disable while loading
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%" }}
            disabled={loading} // ✅ Disable button
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

        <button
          onClick={close}
          style={{
            marginTop: "10px",
            width: "100%",
          }}
          className="btn-outline"
          disabled={loading} // ✅ Prevent closing mid-request
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

export default CreateMatchModal;

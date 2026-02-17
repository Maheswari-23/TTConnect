function Navbar() {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "15px",
        color: "white"
      }}
    >
      <div
        className="container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>🏓 TTConnect</h3>
        <button className="btn-outline" style={{ color: "white", borderColor: "white" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

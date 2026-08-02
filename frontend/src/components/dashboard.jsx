import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!stats) return <h2>Loading Dashboard...</h2>;

  const cardStyle = {
    backgroundColor: "#1e293b",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    minWidth: "220px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#3b82f6",
          marginBottom: "30px",
        }}
      >
        AI Resume Analyzer
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Resumes</h3>
          <h1>{stats.total_resumes}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Average ATS</h3>
          <h1>{stats.average_ats}%</h1>
        </div>

        <div style={cardStyle}>
          <h3>Highest ATS</h3>
          <h1>{stats.highest_ats}%</h1>
        </div>

        <div style={cardStyle}>
          <h3>Lowest ATS</h3>
          <h1>{stats.lowest_ats}%</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
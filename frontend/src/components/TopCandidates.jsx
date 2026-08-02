import { useEffect, useState } from "react";
import axios from "axios";

function TopCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/top-candidates")
      .then((response) => {
        setCandidates(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <h2 style={{ color: "white", textAlign: "center" }}>
        Loading Candidates...
      </h2>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        color: "white",
        padding: "25px",
        borderRadius: "15px",
        marginTop: "30px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        🏆 Top Candidates
      </h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <a
          href="http://127.0.0.1:8000/export-excel"
          target="_blank"
          rel="noreferrer"
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Export Excel
          </button>
        </a>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#334155",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#0f172a",
            }}
          >
            <th style={{ padding: "15px" }}>Name</th>
            <th style={{ padding: "15px" }}>Email</th>
            <th style={{ padding: "15px" }}>ATS</th>
            <th style={{ padding: "15px" }}>Report</th>
          </tr>
        </thead>

        <tbody>
          {filteredCandidates.map((candidate) => (
            <tr
              key={candidate.id}
              style={{
                borderBottom: "1px solid #475569",
              }}
            >
              <td style={{ padding: "12px" }}>
                {candidate.name}
              </td>

              <td style={{ padding: "12px" }}>
                {candidate.email}
              </td>

              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    color: "white",
                    fontWeight: "bold",
                    backgroundColor:
                      candidate.ats_score >= 80
                        ? "#22c55e"
                        : candidate.ats_score >= 60
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                >
                  {candidate.ats_score}%
                </span>
              </td>

              <td style={{ padding: "12px" }}>
                <a
                  href={`http://127.0.0.1:8000/generate-report/${candidate.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#60a5fa",
                    textDecoration: "none",
                  }}
                >
                  Download PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredCandidates.length === 0 && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          No Candidates Found
        </p>
      )}
    </div>
  );
}

export default TopCandidates;
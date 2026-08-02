import { useState } from "react";
import axios from "axios";

function CandidateDetails() {
  const [id, setId] = useState("");
  const [candidate, setCandidate] = useState(null);

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/candidate/${id}`
      );

      setCandidate(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Candidate Details</h2>

      <input
        type="number"
        placeholder="Enter Candidate ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={fetchCandidate}>
        Search
      </button>

      {candidate && (
        <div>
          <h3>{candidate.name}</h3>
          <p>Email: {candidate.email}</p>
          <p>Phone: {candidate.phone}</p>
          <p>ATS Score: {candidate.ats_score}%</p>
          <p>Skills: {candidate.skills}</p>
        </div>
      )}
    </div>
  );
}

export default CandidateDetails;
import { useEffect, useState } from "react";
import axios from "axios";

function TopCandidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/top-candidates")
      .then((response) => {
        setCandidates(response.data);
      });
  }, []);

  return (
    <div>
      <h2>Top Candidates</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>ATS Score</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.ats_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopCandidates;

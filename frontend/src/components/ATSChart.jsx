import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ATSChart() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/top-candidates")
      .then((response) => {
        setCandidates(response.data);
      });
  }, []);

  const data = {
    labels: candidates.map((c) => c.name),
    datasets: [
      {
        label: "ATS Score",
        data: candidates.map((c) => c.ats_score),
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>ATS Analytics</h2>
      <Bar data={data} />
    </div>
  );
}

export default ATSChart;
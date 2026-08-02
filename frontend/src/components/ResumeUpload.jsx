import { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        padding: "30px",
        borderRadius: "15px",
        marginTop: "30px",
        color: "white",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        📄 AI Resume Analyzer
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button
        onClick={uploadResume}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 25px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Analyze Resume
      </button>

      {result && (
        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#334155",
            padding: "25px",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <h2>Analysis Result</h2>

          <p>
            <strong>Name:</strong> {result.name}
          </p>

          <p>
            <strong>Email:</strong> {result.email}
          </p>

          <p>
            <strong>Phone:</strong> {result.phone}
          </p>

          <h3>ATS Score: {result.ats_score}%</h3>

          <div
            style={{
              width: "100%",
              backgroundColor: "#475569",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: `${result.ats_score}%`,
                height: "30px",
                backgroundColor:
                  result.ats_score >= 80
                    ? "#22c55e"
                    : result.ats_score >= 60
                    ? "#f59e0b"
                    : "#ef4444",
                textAlign: "center",
                color: "white",
                lineHeight: "30px",
                fontWeight: "bold",
              }}
            >
              {result.ats_score}%
            </div>
          </div>

          <h3>✅ Skills Found</h3>
          <ul>
            {result.skills?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>❌ Missing Skills</h3>
          <ul>
            {result.missing_skills?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>💡 Suggestions</h3>
          <ul>
            {result.suggestions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
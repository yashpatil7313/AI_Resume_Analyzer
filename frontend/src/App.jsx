import Dashboard from "./components/Dashboard";
import ResumeUpload from "./components/ResumeUpload";
import TopCandidates from "./components/TopCandidates";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Dashboard />
      <ResumeUpload />
      <TopCandidates />
    </div>
  );
}

export default App;
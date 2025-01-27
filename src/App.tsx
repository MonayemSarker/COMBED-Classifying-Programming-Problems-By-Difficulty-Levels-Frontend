import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import "./index.css";
import Survey from "./components/Survey/Survey";
import ProblemComparison from "./components/ProblemCoparison/ProblemComparison";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LandingPage from "./components/LandingPage/LandingPage";
import ProblemClassifierPage from "./components/ProblemClassifier/ProblemClassifierPage";

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/survey-comparison" element={<ProblemComparison />} />
          <Route
            path="/problem-classifier"
            element={<ProblemClassifierPage />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

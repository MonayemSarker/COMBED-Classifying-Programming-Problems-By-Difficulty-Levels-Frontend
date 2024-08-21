import { useState } from "react";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import "./index.css";
import Survey from "./components/Survey/Survey";
import ProblemComparison from "./components/ProblemCoparison/ProblemComparison";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Basic login logic (this would normally involve some API call)
    if (username === "user" && password === "pass") {
      setIsLoggedIn(true);
    } else {
      alert("Incorrect username or password");
    }
  };

  return (
    <div>
      <Header />
      <main>{isLoggedIn ? <HomePage /> : <Login onLogin={handleLogin} />}</main>
      {/* <Survey />  */}
      {/* <ProblemComparison /> */}
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";
//import Survey from './survey/survey';
import Login from "./login/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Survey from "./survey/survey";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/survey"
            element={
              localStorage.getItem("isAuthenticated") === "true" ? (
                <Survey />
              ) : (
                <Login />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

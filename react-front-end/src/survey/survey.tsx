import React, { useState, useEffect } from "react";
import SurveyQuestion, { questions } from "./surveyquestions";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Survey: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
const [formData, setFormData] = useState(
  Object.fromEntries(questions.map(q => [q.name, ""]))
);
  const [submitted, setSubmitted] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

    useEffect(() => {
    const storedName = localStorage.getItem("userInformation");
    if (storedName) {
      const user = JSON.parse(storedName);
      setUsername(user.username);
      setUserId(user.userId);

      // Check if survey already exists for this user
      const apiUrl = process.env.REACT_APP_API_URL;
      if (apiUrl && user.userId) {
        fetch(`${apiUrl}/Survey/exists?userId=${user.userId}`, {
          headers: {
            "Authorization": localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data.exists) {
              setSubmitted(true);
              setSubmitMessage("You have already submitted the survey.");
            }
          })
          .catch(() => {});
      }
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userInformation");
    navigate("/login", { replace: true });
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitMessage(null);
  setSubmitError(null);


  // Prepare answers array
  const answers = questions.map((q) => ({
    Question: q.label,
    Description: q.placeholder || "",
    Answers: formData[q.name as keyof typeof formData],
    CreatedBy: userId,
  }));

  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(apiUrl + "/Survey", {
      method: "POST",
      headers: { 
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({ answers }),
    });
    if (response.ok) {
      setSubmitted(true);
      setSubmitMessage("Your response has been submitted. Thank you!");
    } else {
      setSubmitError("Failed to submit your response. Please try again.");
    }
  } catch (error) {
    setSubmitError(
      "Submission failed. Please check your connection and try again."
    );
  }
};

  const progress = (currentStep / (questions.length - 1)) * 100;

  return (
    <div>
      {/* Navbar/Menu */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Survey App</span>
          <div className="d-flex align-items-center ms-auto">
            {username && (
              <span className="badge bg-light text-primary me-3 fs-6">
                <i className="bi bi-person-circle me-2"></i>
                {username}
              </span>
            )}
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Survey Card */}
      <div className="container mt-5">
        <div
          className="card shadow-sm p-4"
          style={{ maxWidth: 800, margin: "auto" }}
        >
          {submitted ? (
            <div className="text-center">
              {submitMessage && (
                <div className="alert alert-success" role="alert">
                  {submitMessage}
                </div>
              )}
              <h3 className="text-success mb-4">
                Thank you for submitting the survey!
              </h3>
            </div>
          ) : (
            <>
              {submitError && (
                <div className="alert alert-danger" role="alert">
                  {submitError}
                </div>
              )}
              <div className="mb-4">
                <div className="progress" style={{ height: "16px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="text-end text-secondary mt-2">
                  Step {currentStep + 1} of {questions.length} (
                  {Math.round(progress)}%)
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <SurveyQuestion
                  question={questions[currentStep]}
                  value={
                    formData[
                      questions[currentStep].name as keyof typeof formData
                    ]
                  }
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`btn btn-outline-success px-4${
                      currentStep === 0 ? " disabled" : ""
                    }`}
                  >
                    Previous
                  </button>
                  {currentStep < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn btn-success px-4"
                    >
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-success px-4">
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;

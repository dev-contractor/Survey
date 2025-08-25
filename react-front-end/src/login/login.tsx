import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
    fetch(apiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EmailId: username, Password: password }),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          if (data.token) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userInformation", JSON.stringify(data.user));
            setAlert({ type: "success", message: "Login successful! Redirecting..." });
            setTimeout(() => {
              navigate("/survey", { replace: true });
            }, 1000);
          } 
        } else {
          const error = await response.json();
          setAlert({ type: "danger", message: error.message || "Login failed" });
        }
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setAlert({ type: "danger", message: "Network error: " + e.message });
        }
      });
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <h3 className="mb-4 text-center text-primary">Login</h3>
        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setAlert(null)}
            ></button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-bold">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
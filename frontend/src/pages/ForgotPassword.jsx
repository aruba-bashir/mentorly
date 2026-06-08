import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "/src/styles/global-ui.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!email.trim()) {
  setError("Email is required");
  return;
}

const cleanEmail =
  email.trim().toLowerCase();

const emailRegex =
 /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(cleanEmail)) {

  setError(
    "Enter valid email"
  );

  return;
}
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "https://mentorly-backend-9x4x.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
      setError(data.message || "Error occurred");
      return;
    }
      setMessage(" Reset link sent to your email");
      
    } catch (err){
      setError("Server error");
    }
  };

/*return (
    <div className="auth-container">
      <div className="auth-box">

        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Back
        </button>

        <h2>Forgot Password</h2>
        <p>Enter your email to receive reset link</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {message && <p style={{ fontSize: "12px" }}>{message}</p>}

        <button className="auth-btn" onClick={handleSubmit}>
          Send Reset Link
        </button>
      </div>
    </div>
  ); */
return (
  <div className="page-container">
    <div
      className="card"
      style={{
        maxWidth: "420px",
        margin: "40px auto",
      }}
    >
      <button
        className="btn btn-outline"
        onClick={() => navigate("/login")}
        style={{ marginBottom: "18px" }}
      >
        <FiArrowLeft size={16} />
        {" "}Back
      </button>

      <h2 className="title">
        Forgot Password
      </h2>

      <p className="text-muted" style={{ marginBottom: "20px" }}>
        Enter your email to receive reset link
      </p>

      <input
        type="email"
        placeholder="Email address"
        value={email}
        className="form-input"
        onChange={(e) => {

          let value =
            e.target.value;

          value = value
            .replace(/\s/g, "")
            .toLowerCase();

          setEmail(value);

          setError("");
        }}
      />

      {error && (
        <p className="text-error">
          {error}
        </p>
      )}

      {message && (
        <p
          className="text-muted"
          style={{ marginTop: "8px" }}
        >
          {message}
        </p>
      )}

      <button
        className="btn btn-black"
        onClick={handleSubmit}
        style={{
          width: "100%",
          marginTop: "18px",
        }}
      >
        Send Reset Link
      </button>
    </div>
  </div>
);

}

export default ForgotPassword;
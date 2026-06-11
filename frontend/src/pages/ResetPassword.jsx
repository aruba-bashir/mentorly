import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import "/src/styles/global-ui.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    token: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

 /* const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 */
const handleChange = (e) => {

  let { name, value } =
    e.target;

  if (name === "password") {

    value =
      value.trimStart();
  }

  setFormData({
    ...formData,
    [name]: value,
  });

  setError("");
};
  const handleReset = async (e) => {
    e.preventDefault();

    /*if ( !formData.password) {
      setError("All fields required");
      return;
    }
 */
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be strong");
      return;
    }

    setError("");
    setMessage("");

    try {
      const res = await fetch(
       `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
     
         password: formData.password,
}),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);

    } catch {
      setError("Server error");
    }
  };

  
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
        Reset Password
      </h2>

      <p
        className="text-muted"
        style={{ marginBottom: "20px" }}
      >
        Enter new password
      </p>

      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="password"
          placeholder="New password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          style={{
            width: "100%",
            paddingRight: "45px",
          }}
        />

        <span
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform:
              "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showPassword
            ? <FiEyeOff />
            : <FiEye />}
        </span>
      </div>

      <p
        className="text-muted"
        style={{
          fontSize: "13px",
          marginTop: "8px",
        }}
      >
        Must be at least 8 characters,
        include a letter, number &
        special character
      </p>

      {error && (
        <p className="text-error">
          {error}
        </p>
      )}

      {message && (
        <p
          style={{
            color: "green",
            marginTop: "8px",
          }}
        >
          {message}
        </p>
      )}

      <button
        className="btn btn-black"
        onClick={handleReset}
        style={{
          width: "100%",
          marginTop: "18px",
        }}
      >
        Reset Password
      </button>
    </div>
  </div>
);
}

export default ResetPassword;

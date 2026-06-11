
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; //  IMPORTANT
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";


function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); //  use context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input
  /*const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; */
  /*const handleChange = (e) => {

  let { name, value } = e.target;

  // EMAIL
  if (name === "email") {
    value = value.replace(/\s/g, "").toLowerCase();
  }

  // PASSWORD
  if (name === "password") {
    value = value.trimStart();
  }

  setFormData({
    ...formData,
    [name]: value,
  });

  // CLEAR FIELD ERROR
  setErrors((prev) => ({
    ...prev,
    [name]: "",
    api: "",
  }));
};
 */
// Handle input
const handleChange = (e) => {

  let { name, value } = e.target;

  // EMAIL
  if (name === "email") {

    // remove spaces
    value = value.replace(/\s/g, "");

    // lowercase
    value = value.toLowerCase();
  }

  // PASSWORD
  if (name === "password") {

    // prevent leading spaces
    value = value.trimStart();
  }

  setFormData({
    ...formData,
    [name]: value,
  });

  // remove error while typing
  setErrors({
    ...errors,
    [name]: "",
    api: "",
  });
};
  // Validation
  /*const validate = () => {
    let newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    return newErrors;
  }; */
  // Validation
const validate = () => {

  let newErrors = {};

  const cleanEmail =
    formData.email.trim().toLowerCase();

  // EMAIL
  if (!cleanEmail) {

    newErrors.email =
      "Email is required";

  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
  ) {

    newErrors.email =
      "Enter valid email";
  }

  // PASSWORD
  if (!formData.password) {

    newErrors.password =
      "Password is required";

  } else if (
    formData.password.length < 8
  ) {

    newErrors.password =
      "Password too short";
  }

  return newErrors;
};

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.message });
        return;
      }

      // FIX: use context login (NOT localStorage directly)
      login(data);

      //  redirect based on role
      navigate(`/${data.user.role}`);

    } catch (err) {
      setErrors({ api: "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="auth-page">
     
      <div className="auth-card card">
       
        <button className="btn btn-outline " onClick={() => navigate("/")}
         style={{
    marginBottom: "18px",
    display: "flex",
    alignItems : "center",
    gap: "6px",
    width: "fit-content",
  }} >
          <FiArrowLeft size={16} /> Back
        </button>

       <h2 className="title auth-title">
  Welcome back
</h2>

<p className="text-muted auth-subtitle">
  Login to your Mentorly account
</p>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          //className={errors.email ? "input-error" : ""}
          className={`form-input ${errors.email ? "input-error" : ""}`}
        />
        {errors.email && <p className="text-error">{errors.email}</p>}

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
           // className={errors.password ? "input-error" : ""}
           className={`form-input ${errors.password ? "input-error" : ""}`}
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        {errors.password && <p className="text-error">{errors.password}</p>}

        <p
          className=" auth-link-small"
          onClick={() => navigate("/forgot-password")}
          //style={{ cursor: "pointer", marginTop: "6px" }}
          //className="auth-link auth-link-small"
        >
          Forgot password?
        </p>

        {errors.api && <p className="text-error">{errors.api}</p>}

        <button
          className="btn btn-black auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-footer text-muted">
          Don’t have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
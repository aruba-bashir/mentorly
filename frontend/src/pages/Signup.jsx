
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import "/src/styles/global-ui.css";
function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // name regex
  const nameRegex = /^[A-Za-z\s]+$/;

  // Password regex
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const isStrongPassword = passwordRegex.test(formData.password);



  // Handle input
  
const handleChange = (e) => {
  let { name, value } = e.target;

  // NAME validation
  if (name === "name") {
    value = value.replace(/[^A-Za-z\s]/g, "");
    value = value.replace(/\s+/g, " ");
    value = value.trimStart();
  }

  // EMAIL validation
  if (name === "email") {
    value = value.replace(/\s/g, "");   // remove all spaces
    value = value.toLowerCase();        // convert to lowercase
  }

   // PASSWORD (minimal handling)
  if (name === "password") {
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }
  }

  setFormData({ ...formData, [name]: value });
};


  // Validation
  const validate = () => {
    let newErrors = {};

    
    const name = formData.name.trim();

   if (!name) {
  newErrors.name = "Name is required";
   } else if (!nameRegex.test(name)) {
  newErrors.name = "Name should contain only alphabets";
  }

  const email = formData.email.trim().toLowerCase();

if (!email) {
  newErrors.email = "Email is required";
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  newErrors.email = "Enter a valid email (example: user@gmail.com)";
}
    

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Min 8 chars, include letter, number & special character";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    return newErrors;
  };

  // Signup
  const handleSignup = async (e) => {
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
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
              name: formData.name.trim(),
             email: formData.email.trim().toLowerCase(),
             password: formData.password.trim(),
          }),
        }
      );

      const data = await response.json();

       if (!response.ok) {
  toast.error(data.message || "Signup failed");
  return;
}

      //localStorage.setItem("token", data.token);
      //localStorage.setItem("user", JSON.stringify(data.user));

      //navigate("/dashboard");
      //alert("Signup successful. Please verify your email.");
      //navigate("/login");
     // setSuccess("Signup successful! Please check your email to verify.");
     toast.success(
  "Signup successful! Please check your email to verify."
);
      setTimeout(() => {
       navigate("/login");
   }, 2000);
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
  <div className="page-container">
    

    <div
      className="card"
      style={{
        maxWidth: "450px",
        margin: "40px auto",
      }}
    >
      {/* BACK BUTTON */}
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate("/")}
        style={{
          marginBottom: "18px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          width: "fit-content",
        }}
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <h2 className="title">
        Create an account
      </h2>

      <p
        className="text-muted"
        style={{ marginBottom: "20px" }}
      >
        Join Mentorly as a Member,
        Mentor, or Master
      </p>

      {/* NAME */}
      <input
        type="text"
        name="name"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        className="form-input"
      />

      {errors.name && (
        <p className="text-error">
          {errors.name}
        </p>
      )}

      {/* EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        className="form-input"
        style={{ marginTop: "14px" }}
      />

      {errors.email && (
        <p className="text-error">
          {errors.email}
        </p>
      )}

      {/* PASSWORD */}
      <div
        style={{
          position: "relative",
          marginTop: "14px",
        }}
      >
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name="password"
          placeholder="Password"
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

      {/* PASSWORD STRENGTH */}
      {formData.password && (
        <p
          style={{
            color:
              isStrongPassword
                ? "green"
                : "red",
            fontSize: "13px",
            marginTop: "8px",
          }}
        >
          {isStrongPassword
            ? "Strong password"
            : "Weak password"}
        </p>
      )}

      <p
        className="text-muted"
        style={{
          fontSize: "13px",
          marginTop: "6px",
        }}
      >
        Must be at least 8 characters,
        include a letter, number &
        special character
      </p>

      {errors.password && (
        <p className="text-error">
          {errors.password}
        </p>
      )}

      {/* ROLE */}
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="form-input"
        style={{ marginTop: "14px" }}
      >
        <option value="">
          Select account type
        </option>

        <option value="member">
          Member (Student)
        </option>

        <option value="mentor">
          Mentor (Alumni / Working Professional)
        </option>

        <option value="master">
          Master (Professor / Academic)
        </option>
      </select>

      {errors.role && (
        <p className="text-error">
          {errors.role}
        </p>
      )}

      {/* API ERROR */}
     {/* {errors.api && (
        <p className="text-error">
          {errors.api}
        </p>
      )} */}

      {/* SUCCESS */}
     { /*{success && (
        <p
          style={{
            color: "green",
            marginTop: "10px",
          }}
        >
          {success}
        </p>
      )} */}

      {/* BUTTON */}
      <button
        className="btn btn-black"
        onClick={handleSignup}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "18px",
        }}
      >
        {loading
          ? "Signing up..."
          : "Sign up"}
      </button>

      <div
        className="text-muted"
        style={{
          marginTop: "16px",
          fontSize: "14px",
        }}
      >
        Already have an account?{" "}

        <span className="auth-link"
          onClick={() =>
            navigate("/login")
          }
          style={{
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Login
        </span>
      </div>
    </div>
  </div>
);
}

export default Signup;
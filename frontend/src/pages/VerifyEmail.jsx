
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  
  const [message, setMessage] = useState("Verifying...");
  const hasCalled = useRef(false); //  prevent double call
   const navigate = useNavigate();

  useEffect(() => {
    if (hasCalled.current) return; //  stop second call
    hasCalled.current = true;

    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/auth/verify-email/${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Verification failed");
        } else {
          setMessage("Email verified successfully! Redirecting to login...");
          //rediredt after 2 secs
          setTimeout(()=>{
            navigate("/login");
          },2000);
        }
      } catch (err) {
        setMessage("Server error");
      }
    };

    verify();
  }, [token]);

  return <h2>{message}</h2>;
}

export default VerifyEmail;
import { useEffect, useState } from "react";
import axios from "axios";
//import "/src/styles/internships.css";
export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch all internships
  const fetchInternships = () => {
    axios
      .get("https://mentorly-backend-9x4x.onrender.com/internships", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInternships(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Delete internship (admin only)
  const deleteInternship = async (id) => {
    try {
      await axios.delete(`https://mentorly-backend-9x4x.onrender.com/internships/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchInternships();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

       return (
  <div className="page-container">
    <h2 className="title">Admin Internships Panel</h2>

    {internships.length === 0 && (
      <p className="text-muted">No internships found</p>
    )}

    <div className="grid">
      {internships.map((intern) => (
        <div key={intern._id} className="card">

          <h3>{intern.title}</h3>

           <p className="text-muted">
            <b>Company:</b> {intern.company}
          </p>

          <p className="text-muted">
            <b>Location:</b> {intern.location}
          </p>

          <p className="text-muted">
            <b>Stipend:</b> {intern.stipend || "Not specified"}
          </p>

          <p style={{ whiteSpace: "pre-line" }}>
            <b>Description:</b> {intern.description}
          </p>

          <p className="text-muted">
            <b>Posted by:</b>{" "}
            {intern.created_by
              ? `${intern.created_by.role} (${intern.created_by.name})`
              : "External"}
          </p>

          <p className="text-muted">
            <b>Applicants:</b> {intern.applicants?.length || 0}
          </p>

          <button
            onClick={() => deleteInternship(intern._id)}
            className="btn btn-black"
          >
            Delete Internship
          </button>
        </div>
      ))}
    </div>
  </div>
);
} 


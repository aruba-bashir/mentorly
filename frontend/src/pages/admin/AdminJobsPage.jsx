import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // IMPORTANT (don’t decode JWT)

  // Fetch all jobs
  const fetchJobs = () => {
    axios
      .get("https://mentorly-backend-9x4x.onrender.com/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job (admin only)
  const deleteJob = async (id) => {
    try {
      await axios.delete(`https://mentorly-backend-9x4x.onrender.com/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };


  return (
  <div className="page-container">

    <h2 className="title">Admin Jobs Panel</h2>

    {jobs.length === 0 && (
      <p className="text-muted">No jobs found</p>
    )}

    <div className="grid">

      {jobs.map((job) => (

        <div key={job._id} className="card">

          <h3>{job.title}</h3>
          
           <p className="text-muted">
            <b>Company:</b> {job.company}
          </p>

          <p className="text-muted">
            <b>Location:</b> {job.location}
          </p>

          <p className="text-muted">
            <b>Salary:</b> {job.salary}
          </p>

          <p style={{ whiteSpace: "pre-line" }}>
            <b>Description:</b> {job.description}
          </p>

          <p className="text-muted">
            <b>Posted by:</b>{" "}
            {job.created_by
              ? `${job.created_by.role} (${job.created_by.name})`
              : "External"}
          </p>

          <p className="text-muted">
            <b>Applicants:</b> {job.applicants?.length || 0}
          </p>

          {/* ADMIN ACTION */}
          <button
            onClick={() => deleteJob(job._id)}
            className="btn btn-black"
          >
            Delete Job
          </button>

        </div>
      ))}
    </div>
  </div>
);
}
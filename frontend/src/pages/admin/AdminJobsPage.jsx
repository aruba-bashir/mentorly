import { useEffect, useState } from "react";
import axios from "axios";
import "/src/styles/internships.css";
export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [showFull, setShowFull] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // IMPORTANT (don’t decode JWT)

  // Fetch all jobs
  const fetchJobs = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchJobs();
    setCurrentPage(1);
  }, []);

  // Delete job (admin only)
  const deleteJob = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

 const totalPages = Math.ceil(
  jobs.length / itemsPerPage
);

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentJobs =
  jobs.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); 
  
  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";

  return (
  <div className="page-container">

    <h2 className="title">Admin Jobs Panel</h2>

    {jobs.length === 0 && (
      <p className="text-muted">No jobs found</p>
    )}

    <div className="grid internship-list">

      {currentJobs.map((job) => (

        <div key={job._id} className="card">

          <h3>{job.title}</h3>


          {job.source === "external" && (

        <p className="text-muted">
           External Opportunity
          </p>
         )}
           <p className="text-muted">
            <b>Company:</b> {job.company}
          </p>

          <p className="text-muted">
            <b>Location:</b> {job.location}
          </p>

        {job.source !== "external" && (
  <p className="text-muted">
    <b>Salary:</b> {job.salary}
  </p>
)}

<p className="text-muted">
            <b>Posted by:</b>{" "}
            {job.created_by
              ? `${job.created_by.role} (${job.created_by.name})`
              : "External"}
          </p>
          
          {job.source !== "external" && (
          <p className="text-muted">
          Applicants: {job.applicants?.length || 0}
          </p>
          )}
<p className="description">
  {showFull[job._id]
    ? cleanDescription(job.description)
    : cleanDescription(job.description).slice(0, 300) + "..."}
</p> 
         
<button
  className="btn btn-outline"
  onClick={() =>
    setShowFull(prev => ({
      ...prev,
      [job._id]: !prev[job._id]
    }))
  }
>
  {showFull[job._id] ? "Show Less" : "Read More"}
</button>

          
         
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

    {totalPages > 1 && (
  <div className="pagination">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage(currentPage - 1)
      }
    >
      Previous
    </button>

    <span className="page-info">
      Page {currentPage} of {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage(currentPage + 1)
      }
    >
      Next
    </button>

  </div>
)}
  </div>
);
}
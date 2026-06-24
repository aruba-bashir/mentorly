import { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

import "/src/styles/internships.css";
export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showFull, setShowFull] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

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
  const filteredJobs = jobs.filter((job) =>
  (job.title || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  (job.company || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  // Delete job (admin only)
  const deleteJob = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchJobs();
      toast.success("Job deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

 const totalPages = Math.ceil(
 filteredJobs.length / itemsPerPage
);

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentJobs =
  filteredJobs.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); 
  
  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";

  return (
  <div className="page-container">

    <h2 className="title">Admin Jobs Panel</h2>

    <input
  type="text"
  placeholder="Search by title or company..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }}
  className="search-input"
/>

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
  onClick={() => {
    setSelectedJobId(job._id);
    setShowDeleteModal(true);
  }}
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
<ConfirmModal
  show={showDeleteModal}
  title="Delete Job"
  message="Are you sure you want to delete this job?"
  confirmText="Delete"
  onClose={() => {
    setShowDeleteModal(false);
    setSelectedJobId(null);
  }}
  onConfirm={async () => {
    await deleteJob(selectedJobId);
    setShowDeleteModal(false);
    setSelectedJobId(null);
  }}
/>
  </div>
);
}
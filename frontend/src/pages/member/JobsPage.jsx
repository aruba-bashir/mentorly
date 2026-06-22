
import { useEffect, useState } from "react";
import axios from "axios";
import "/src/styles/internships.css";
export default function MemberJobsPage() {

  const [jobs, setJobs] = useState([]);

  //  Search states
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [showFull, setShowFull] = useState({});
 const [currentPage, setCurrentPage] = useState(1);
 const [recommendedJobs, setRecommendedJobs] = useState([]);

  const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  //  Safe decode
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = decoded?.id;

  //  Fetch jobs function
  const fetchJobs = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search,
        company,
        location,
        salary
      }
    })
    .then(res => setJobs(res.data))
    .catch(err => console.error(err));
  }; 

  const fetchRecommendedJobs = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/recommendations/jobs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRecommendedJobs(res.data);

  } catch (err) {
    console.error(err);
  }
};

  //  Call when filters change
  useEffect(() => {
    fetchJobs();
    fetchRecommendedJobs();
     setCurrentPage(1);
  }, [search,company, location, salary]);

  //  Apply job
  const applyJob = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Applied Successfully");
      fetchJobs(); // refresh to update "Applied" button

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    
    }
  };
 

  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";

  const recommendedIds = new Set(
  recommendedJobs.map(job => job._id)
);

const hasFilters =
  search ||
  company ||
  location ||
  salary;

const orderedJobs = hasFilters
  ? jobs
  : [
      ...recommendedJobs,
      ...jobs.filter(
        job => !recommendedIds.has(job._id)
      )
    ];
const totalPages = Math.ceil(
  orderedJobs.length / itemsPerPage
);

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentJobs =
  orderedJobs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );  
  return (
  <div className="page-container">

    <h2 className="title">Available Jobs</h2>

    {/* FILTER BAR */}
    <div className="filter-bar">

      <input
        className="form-input"
        placeholder="Search title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
       <input
        className="form-input"
        placeholder="Company..."
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        className="form-input"
        placeholder="Location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        className="form-input"
        placeholder="Salary..."
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

    </div>

    {/* EMPTY STATE */}
    {jobs.length === 0 && (
      <p className="text-muted">No Jobs available</p>
    )}

    {/* GRID */}
    <div className="grid internship-list">

      {currentJobs.map(job => (

        <div key={job._id} className="card">

          <h3>{job.title}</h3>

         {recommendedIds.has(job._id) && (
         <p style={{ color: "green" }}>
         Recommended
          </p>
          )}

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
        <p className="description">
  {showFull[job._id]
    ? cleanDescription(job.description)
    : cleanDescription(job.description).slice(0, 300) + "..."}
</p> 

   <p className="text-muted">
  <b>Posted by:</b>{" "}
  {job.source === "external"
    ? "External"
    : "Internal"}
</p>

{job.source !== "external" && (
  <p className="text-muted">
    Applicants: {job.applicants?.length || 0}
  </p>
)}

<div className="card-actions">

  <button
    className="btn btn-outline"
    onClick={() =>
      setShowFull(prev => ({
        ...prev,
        [job._id]: !prev[job._id]
      }))
    }
  >
    {showFull[job._id]
      ? "Show Less"
      : "Read More"}
  </button>

  {job.source === "external" ? (

    <button
      className="btn btn-primary"
      onClick={() =>
        window.open(
          job.applyLink,
          "_blank"
        )
      }
    >
      Apply on Website
    </button>

  ) : job.applicants?.includes(userId) ? (

    <button
      className="btn btn-outline"
      disabled
    >
      Applied
    </button>

  ) : (

    <button
      className="btn btn-primary"
      onClick={() =>
        applyJob(job._id)
      }
    >
      Apply
    </button>

  )}

</div>
         
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
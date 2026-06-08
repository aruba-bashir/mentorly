
import { useEffect, useState } from "react";
import axios from "axios";

export default function MemberJobsPage() {

  const [jobs, setJobs] = useState([]);

  //  Search states
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const token = localStorage.getItem("token");

  //  Safe decode
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = decoded?.id;

  //  Fetch jobs function
  const fetchJobs = () => {
    axios.get("https://mentorly-backend-9x4x.onrender.com/jobs", {
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

  //  Call when filters change
  useEffect(() => {
    fetchJobs();
  }, [search,company, location, salary]);

  //  Apply job
  const applyJob = async (id) => {
    try {
      await axios.post(
        `https://mentorly-backend-9x4x.onrender.com/jobs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Applied Successfully");
      fetchJobs(); // refresh to update "Applied" button

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

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
    <div className="grid">

      {jobs.map(job => (

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

          {/* APPLY BUTTON */}
          {job.applicants?.some(id => id.toString() === userId) ? (
            <button className="btn btn-outline" disabled>
              Applied
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => applyJob(job._id)}
            >
              Apply
            </button>
          )}

        </div>
      ))}

    </div>
  </div>
);
}
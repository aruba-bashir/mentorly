
import { useEffect, useState } from "react";
import axios from "axios";
import "/src/styles/internships.css";

export default function InternshipsPage() {

  const [internships, setInternships] = useState([]);

  // Search states
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");

  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  //other states ....
  const [showFull, setShowFull] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = decoded?.id;

  //  Fetch internships
  const fetchInternships = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/internships`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search,
        company,
        location,
        stipend
      }
    })
    .then(res => setInternships(res.data))
    .catch(err => console.error(err));
  };

  //  Auto fetch when filters change
  useEffect(() => {
    fetchInternships();
    setCurrentPage(1);
  }, [search, company ,location, stipend]);

  //  Apply internship
  const applyInternship = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/internships/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Applied successfully");
      fetchInternships(); // refresh button state

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };
  const totalPages = Math.ceil(
  internships.length / itemsPerPage
);

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentInternships =
  internships.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";
  return (
  <div className="page-container">

    <h2 className="title">Available Internships</h2>

    {/* SEARCH */}
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
        placeholder="Stipend..."
        value={stipend}
        onChange={(e) => setStipend(e.target.value)}
      />

    </div>

    {/* EMPTY STATE */}
    {internships.length === 0 && (
      <p className="text-muted">No internships available</p>
    )}

    {/* LIST */}
    <div className="grid internship-list">

      {currentInternships.map((internship) => (

        <div className="card" key={internship._id}>

          <h3>{internship.title}</h3>
         
         {internship.source === "external" && (

        <p className="text-muted">
           External Opportunity
          </p>
         )}

          <p className="text-muted">
            {internship.company}
          </p>


          <p className="text-muted">
            {internship.location}
          </p>

         {internship.source !== "external" && (
        <p>
       <b>Stipend:</b> {internship.stipend}
       </p>
       )}

       <p className="description">
  {showFull[internship._id]
    ? cleanDescription(internship.description)
    : cleanDescription(internship.description).slice(0, 300) + "..."}
</p> 

    <p className="text-muted">
  <b>Posted by:</b>{" "}
  {internship.source === "external"
    ? "External"
    : "Internal"}
</p>

{internship.source !== "external" && (
  <p className="text-muted">
    Applicants: {internship.applicants?.length || 0}
  </p>
)}

<div className="card-actions">

  <button
    className="btn btn-outline"
    onClick={() =>
      setShowFull(prev => ({
        ...prev,
        [internship._id]: !prev[internship._id]
      }))
    }
  >
    {showFull[internship._id]
      ? "Show Less"
      : "Read More"}
  </button>

  {internship.source === "external" ? (

    <button
      className="btn btn-primary"
      onClick={() =>
        window.open(
          internship.applyLink,
          "_blank"
        )
      }
    >
      Apply on Website
    </button>

  ) : internship.applicants?.includes(userId) ? (

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
        applyInternship(internship._id)
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
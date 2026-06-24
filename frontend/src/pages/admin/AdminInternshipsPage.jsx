import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

import "/src/styles/internships.css";
export default function AdminInternshipsPage() {

  const [internships, setInternships] = useState([]);
   const [search, setSearch] = useState("");
  const [showFull, setShowFull] = useState({});

 const [showDeleteModal, setShowDeleteModal] = useState({
  show: false,
  id: null,
});
   

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const token = localStorage.getItem("token");

  // Fetch all internships
  const fetchInternships = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/internships`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInternships(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchInternships();
    setCurrentPage(1);
  }, []);

  const filteredInternships = internships.filter(
  (intern) =>
    (intern.title || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (intern.company || "")
      .toLowerCase()
      .includes(search.toLowerCase())
);

  // Delete internship (admin only)
  /*const deleteInternship = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/internships/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchInternships();
     
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  }; */

  const deleteInternship = (id) => {
  return axios.delete(
    `${import.meta.env.VITE_API_URL}/internships/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
const totalPages = Math.ceil(
  filteredInternships.length / itemsPerPage
);

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentInternships =
  filteredInternships.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";

       return (
  <div className="page-container">
    <h2 className="title">Admin Internships Panel</h2>

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

    {internships.length === 0 && (
      <p className="text-muted">No internships found</p>
    )}

    <div className="grid internship-list">
      {currentInternships.map((intern) => (
        <div key={intern._id} className="card">

          <h3>{intern.title}</h3>

          {intern.source === "external" && (

        <p className="text-muted">
           External Opportunity
          </p>
         )}

           <p className="text-muted">
            <b>Company:</b> {intern.company}
          </p>

          <p className="text-muted">
            <b>Location:</b> {intern.location}
          </p>

         {intern.source !== "external" && (
  <p className="text-muted">
    <b>Stipend:</b> {intern.stipend}
  </p>
)}
 <p className="text-muted">
            <b>Posted by:</b>{" "}
            {intern.created_by
              ? `${intern.created_by.role} (${intern.created_by.name})`
              : "External"}
          </p>

           {intern.source !== "external" && (
           <p className="text-muted">
            Applicants: {intern.applicants?.length || 0}
            </p>
            )}
          <p className="description">
  {showFull[intern._id]
    ? cleanDescription(intern.description)
    : cleanDescription(intern.description).slice(0, 300) + "..."}
</p> 

<button 
  className="btn btn-outline"
  onClick={() =>
    setShowFull(prev => ({
      ...prev,
      [intern._id]: !prev[intern._id]
    }))
  }
>
  {showFull[intern._id] ? "Show Less" : "Read More"}
</button>

         
         
          <button
          onClick={() => {
  setShowDeleteModal({
    show: true,
    id: intern._id,
  });
}}
            className="btn btn-black"
          >
            Delete Internship
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
  show={showDeleteModal.show}
  title="Delete Internship"
  message="Are you sure you want to delete this internship?"
  confirmText="Delete"
  onClose={() =>
    setShowDeleteModal({ show: false, id: null })
  }
  onConfirm={async () => {
    try {
      await deleteInternship(showDeleteModal.id);
      toast.success("Internship deleted successfully");
      fetchInternships();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal({ show: false, id: null });
    }
  }}
/>

  </div>
);
} 


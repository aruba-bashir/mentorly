
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import "/src/styles/internships.css";

export default function MentorInternshipsPage() {

  const [internships, setInternships] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [showFull, setShowFull] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const token = localStorage.getItem("token");

  const decoded = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  const userId = decoded?.id || decoded?._id;
  const user = decoded;

  // FETCH INTERNSHIPS
  const fetchInternships = () => {

    axios
      .get(`${import.meta.env.VITE_API_URL}/internships`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {

        console.log(
          "Internships Data:",
          res.data
        );

        if (Array.isArray(res.data)) {
          setInternships(res.data);
        } else {
          setInternships([]);
        }
      })

      .catch((err) => {

        console.error(
          "Fetch Internships Error:",
          err
        );

        setInternships([]);
      });
  };
   const fetchRecommendations = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/recommendations/internships`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRecommendedInternships(res.data);

  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchInternships();
    fetchRecommendations();
     setCurrentPage(1);
  }, []);

  // HANDLE INPUT
  const handleInputChange = (
    field,
    value
  ) => {

    // remove leading spaces
    value = value.replace(/^\s+/, "");

    // TITLE
    if (field === "title") {

      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }

      setTitle(value);
    }
    if (field === "company") {
  value = value.replace(/^\s+/, "");

  // allow letters, numbers, spaces, &, ., -
  value = value.replace(/[^A-Za-z0-9&.\- ]/g, "");

  setCompany(value);
}
    // LOCATION
    if (field === "location") {

      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }

      setLocation(value);
    }

    // DESCRIPTION
    if (field === "description") {

      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }

      setDescription(value);
    }

    // STIPEND
    if (field === "stipend") {

      if (
        value.length === 1 &&
        !/^[₹$0-9Rr]/.test(value)
      ) {
        return;
      }

      // allow only safe chars
      value = value.replace(
        /[^0-9₹$A-Za-z,./\s]/g,
        ""
      );

      setStipend(value);
    }

    setErrors({
      ...errors,
      [field]: "",
    });
  };

  // VALIDATION
  const validateForm = () => {

    let newErrors = {};

    const cleanTitle =
      title.trim();

    const cleanCompany =
      company.trim();

    const cleanLocation =
      location.trim();

    const cleanStipend =
      stipend.trim();

    const cleanDescription =
      description.trim();

    // TITLE
    if (!cleanTitle) {

      newErrors.title =
        "Title is required";

    } else if (
      !/^[A-Za-z]/.test(cleanTitle)
    ) {

      newErrors.title =
        "Title must start with alphabet";

    } else if (
      cleanTitle.length < 3
    ) {

      newErrors.title =
        "Title too short";
    }

    // company
    if (!cleanCompany) {

      newErrors.company =
        "Company name  is required";

    } else if (!company.match(/^[A-Za-z0-9&.\- ]+$/))
     {

      newErrors.company =
        "Company name must start with alphabet";

    } else if (
      cleanCompany.length < 2
    ) {

      newErrors.company =
        "Company name is too short";
    }

    // LOCATION
    if (!cleanLocation) {

      newErrors.location =
        "Location required";

    } else if (
      !/^[A-Za-z]/.test(cleanLocation)
    ) {

      newErrors.location =
        "Location must start with alphabet";
    }

    // STIPEND
    const stipendRegex =
      /^(₹|Rs\.?|rs\.?|\$)?\s?\d+(,\d{3})*(\s)?(LPA|lpa|k|K|\/month|per month)?$/;

    if (!cleanStipend) {

      newErrors.stipend =
        "Stipend required";

    } else if (
      !stipendRegex.test(cleanStipend)
    ) {

      newErrors.stipend =
        "Enter valid stipend format";
    }

    // DESCRIPTION
    if (!cleanDescription) {

      newErrors.description =
        "Description required";

    } else if (
      !/^[A-Za-z]/.test(cleanDescription)
    ) {

      newErrors.description =
        "Description must start with alphabet";

    } else if (
      cleanDescription.length < 15
    ) {

      newErrors.description =
        "Description too short";
    }

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {

      setErrors(validationErrors);

      return;
    }

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/internships`,
        {
          title: title.trim(),
          company: company.trim(),
          location: location.trim(),
          stipend: stipend.trim(),
          description:
            description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setCompany("");
      setLocation("");
      setStipend("");
      setDescription("");

      setErrors({});

      fetchInternships();
      toast.success("Internship created successfully");

    } catch (err) {

      console.error(
        "Create Internship Error:",
        err
      );

     toast.error(
  err.response?.data?.message ||
  "Failed to create internship"
);
    }
  };

  // DELETE
 /* const deleteInternship = async (
    id
  ) => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/internships/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchInternships();

    } catch (err) {

      console.error(
        "Delete Internship Error:",
        err
      );
    }
  };
  */
 const deleteInternship = async (id) => {
  try {

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/internships/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Internship deleted successfully");

    fetchInternships();

  } catch (err) {

    console.error(
      "Delete Internship Error:",
      err
    );

    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );
  }
};
  
  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";

  const orderedInternships = [
  ...recommendedInternships,

  ...internships.filter(
    internship =>
      !recommendedInternships.some(
        rec => rec._id === internship._id
      )
  ),
];
const recommendedIds = new Set(
  recommendedInternships.map(
    internship => internship._id
  )
);

const totalPages = Math.ceil(
  orderedInternships.length / itemsPerPage
);

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentInternships =
  orderedInternships.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
 
  return (
  <div className="page-container">

    <h2 className="title"> All Internships </h2>

    {/* FORM */}
    <div className="card internship-form">

      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          handleInputChange("title", e.target.value)
        }
      />
      {errors.title && <p className="text-error">{errors.title}</p>}

      <input
        placeholder="Company"
        value={company}
        onChange={(e) =>
          handleInputChange("company", e.target.value)
        }
      />
      {errors.company && <p className="text-error">{errors.company}</p>}

      <input
        placeholder="Location"
        value={location}
        onChange={(e) =>
          handleInputChange("location", e.target.value)
        }
      />
      {errors.location && <p className="text-error">{errors.location}</p>}

      <input
        placeholder="Stipend"
        value={stipend}
        onChange={(e) =>
          handleInputChange("stipend", e.target.value)
        }
      />
      {errors.stipend && <p className="text-error">{errors.stipend}</p>}

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          handleInputChange("description", e.target.value)
        }
      />
      {errors.description && <p className="text-error">{errors.description}</p>}

      <button className="btn btn-primary" onClick={handleSubmit}>
        Create Internship
      </button>

    </div>

    {/* LIST */}
    <div className="grid internship-list">

      {orderedInternships.length === 0 ? (
        <p className="text-muted">No internships available</p>
      ) : (
        currentInternships.map((internship) => {

         
            const creatorId =
  typeof internship.created_by === "object"
    ? internship.created_by?._id
    : internship.created_by;

const canDelete =
  user?.role?.toLowerCase() === "admin" ||
  
  creatorId === userId;
          
          return(
          <div key={internship._id} className="card internship-card">

            <h3>{internship.title}</h3>

            {recommendedIds.has(internship._id) && (
         <p style={{ color: "green" }}>
         Recommended
          </p>
          )}

            {internship.source === "external" && (

        <p className="text-muted">
           External Opportunity
          </p>
         )}
            <p className="text-muted"><b>Company:</b> {internship.company}</p>
            <p className="text-muted"><b>Location:</b> {internship.location}</p>
            {internship.source !== "external" && (
  <p>
    <b>Stipend:</b> {internship.stipend}
  </p>
)}

<p className="meta">
              <b>Posted by:</b>{" "}
              {internship.created_by?.role
                ? `${internship.created_by.role} (${internship.created_by.name})`
                : "External"}
            </p>


            {internship.source !== "external" && (
  <p className="text-muted">
    Applicants: {internship.applicants?.length || 0}
  </p>
)}
          <p className="description">
  {showFull[internship._id]
    ? cleanDescription(internship.description)
    : cleanDescription(internship.description).slice(0, 300) + "..."}
</p> 


<button
  className="btn btn-outline"
  onClick={() =>
    setShowFull(prev => ({
      ...prev,
      [internship._id]: !prev[internship._id]
    }))
  }
>
  {showFull[internship._id] ? "Show Less" : "Read More"}
</button>

            


            {canDelete && (
                <button
                  className="btn btn-black"
                 onClick={() => {
  setSelectedInternshipId(internship._id);
  setShowDeleteModal(true);
}}
                >
                  Delete
                </button>
              )}

          </div>
        );
    })
      )}
      
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
  title="Delete Internship"
  message="Are you sure you want to delete this internship?"
  confirmText="Delete"
  onClose={() => {
    setShowDeleteModal(false);
    setSelectedInternshipId(null);
  }}
  onConfirm={async () => {
    await deleteInternship(selectedInternshipId);
    setShowDeleteModal(false);
    setSelectedInternshipId(null);
  }}
/>
  </div>
);
}
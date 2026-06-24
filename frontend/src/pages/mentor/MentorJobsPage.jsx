
  import { useEffect, useState } from "react";
  import axios from "axios";
  import "/src/styles/internships.css";
  import { toast } from "react-toastify";
  import ConfirmModal from "../../components/ConfirmModal";
  export default function MentorJobsPage() {

  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});
 const [showFull, setShowFull] = useState({});
 const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedJobId, setSelectedJobId] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  const decoded = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  const userId = decoded?.id || decoded?._id;
  const user = decoded;

  // FETCH JOBS
  const fetchJobs = () => {

    axios
      .get(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {

        console.log("Jobs Data:", res.data);

        if (Array.isArray(res.data)) {
          setJobs(res.data);
        } else {
          setJobs([]);
        }
      })

      .catch((err) => {

        console.error("Fetch Jobs Error:", err);

        setJobs([]);
      });
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
  useEffect(() => {
    fetchJobs();
    fetchRecommendedJobs();
    setCurrentPage(1);
  }, []);

  // HANDLE INPUT
  const handleInputChange = (field, value) => {

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

    // company 
    if (field === "company") {

      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }

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

    // SALARY
    if (field === "salary") {

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

      setSalary(value);
    }

    setErrors({
      ...errors,
      [field]: "",
    });
  };

  // VALIDATION
  const validateForm = () => {

    let newErrors = {};

    const cleanTitle = title.trim();
    const cleanCompany = company.trim();
    const cleanLocation = location.trim();
    const cleanSalary = salary.trim();
    const cleanDescription = description.trim();

    // TITLE
    if (!cleanTitle) {

      newErrors.title = "Title is required";

    } else if (
      !/^[A-Za-z]/.test(cleanTitle)
    ) {

      newErrors.title =
        "Title must start with alphabet";

    } else if (cleanTitle.length < 3) {

      newErrors.title = "Title too short";
    }

    // company
    if (!cleanCompany) {

      newErrors.company = "company name  is required";

    } else if (
      !/^[A-Za-z]/.test(cleanTitle)
    ) {

      newErrors.company =
        "Company name must start with alphabet";

    } else if (cleanCompany.length < 2) {

      newErrors.company = "Company name is  too short";
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

    // SALARY
    const salaryRegex =
      /^(₹|Rs\.?|rs\.?|\$)?\s?\d+(,\d{3})*(\s)?(LPA|lpa|k|K|\/month|per month)?$/;

    if (!cleanSalary) {

      newErrors.salary =
        "Salary/Stipend required";

    } else if (
      !salaryRegex.test(cleanSalary)
    ) {

      newErrors.salary =
        "Enter valid salary/stipend format";
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
      Object.keys(validationErrors).length > 0
    ) {

      setErrors(validationErrors);

      return;
    }

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs`,
        {
          title: title.trim(),
          company: company.trim(),
          location: location.trim(),
          salary: salary.trim(),
          description: description.trim(),
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
      setSalary("");
      setDescription("");

      setErrors({});

      fetchJobs();
      toast.success("Job created successfully");

    } catch (err) {

      console.error(
        "Create Job Error:",
        err
      );
     toast.error(
  err.response?.data?.message ||
  "Failed to create job"
);
    
    }
  };

  // DELETE
  /*const deleteJob = async (id) => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchJobs();

    } catch (err) {

      console.error(
        "Delete Error:",
        err
      );
    }
  };
    */
   const deleteJob = async (id) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/jobs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Job deleted successfully");
    fetchJobs();

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Delete failed"
    );
  }
};

  const cleanDescription = (description) =>
  description?.replace(/\s+/g, " ").trim() || "";

  const recommendedIds = new Set(
  recommendedJobs.map(job => job._id)
);

const orderedJobs = [
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

    <h2 className="title">All Jobs</h2>

    {/* FORM */}
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "20px" }}>

      <div className="form-row">

        <input
          className="form-input"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            handleInputChange("title", e.target.value)
          }
        />

         <input
          className="form-input"
          placeholder="Company"
          value={company}
          onChange={(e) =>
            handleInputChange("company", e.target.value)
          }
        />

        <input
          className="form-input"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            handleInputChange("location", e.target.value)
          }
        />

        <input
          className="form-input"
          placeholder="Salary / Stipend"
          value={salary}
          onChange={(e) =>
            handleInputChange("salary", e.target.value)
          }
        />

      </div>

      <textarea
        className="form-input"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          handleInputChange("description", e.target.value)
        }
      />

      <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }}>
        Create Job
      </button>

    </form>

    {/* ERRORS */}
    {Object.values(errors).map((err, i) => (
      <p key={i} className="text-error">{err}</p>
    ))}

    <hr />

    {/* JOB LIST */}
    {orderedJobs.length === 0 ? (
      <p className="text-muted">No Jobs available</p>
    ) : (
      <div className="grid internship-list">

        {currentJobs.map((job) => {

          const canDelete =
            user?.role?.toLowerCase() === "admin" ||
            (
              job.created_by &&
              (
                job.created_by._id?.toString?.() === userId ||
                job.created_by?.toString?.() === userId
              )
            );

          return (
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

     <p className="text-muted">
                <b>Posted by:</b>{" "}
                {job.created_by?.role && job.created_by?.name
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

              {canDelete && (
                <button
                 onClick={() => {
  setSelectedJobId(job._id);
  setShowDeleteModal(true);
}}
                  className="btn btn-black"
                >
                  Delete
                </button>
              )}

            </div>
          );
        })}

      </div>
    )}

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

  import { useEffect, useState } from "react";
  import axios from "axios";

 export default function MentorJobsPage() {

  const [jobs, setJobs] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const decoded = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  const userId = decoded?.id || decoded?._id;
  const user = decoded;

  // FETCH JOBS
  const fetchJobs = () => {

    axios
      .get("http://localhost:5001/jobs", {
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

  useEffect(() => {
    fetchJobs();
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
        "http://localhost:5001/jobs",
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

    } catch (err) {

      console.error(
        "Create Job Error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to create job"
      );
    }
  };

  // DELETE
  const deleteJob = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5001/jobs/${id}`,
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
    {jobs.length === 0 ? (
      <p className="text-muted">No Jobs available</p>
    ) : (
      <div className="grid">

        {jobs.map((job) => {

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
                {job.created_by?.role && job.created_by?.name
                  ? `${job.created_by.role} (${job.created_by.name})`
                  : "External"}
              </p>

              <p className="text-muted">
                <b>Applicants:</b>{" "}
                {Array.isArray(job.applicants)
                  ? job.applicants.length
                  : 0}
              </p>

              {canDelete && (
                <button
                  onClick={() => deleteJob(job._id)}
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

  </div>
);
}


import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import "./Profile.css";

function Profile() {

  const [user, setUser] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  // FETCH PROFILE
  const fetchProfile = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setUser(data);
      localStorage.setItem(
  "user",
  JSON.stringify(data)
);
      

      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        skills: Array.isArray(data.skills)
          ? data.skills.join(", ")
          : "",
      });

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {

    let value = e.target.value;

    // remove leading spaces
    value = value.replace(/^\s+/, "");

    // NAME validation while typing
    if (e.target.name === "name") {

      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }
    }

    // BIO validation while typing
    if (e.target.name === "bio") {

      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // FILE CHANGE
  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    // TYPE VALIDATION
    if (
      !allowedTypes.includes(selectedFile.type)
    ) {

      setErrors({
        ...errors,
        file: "Only JPG, PNG, WEBP allowed",
      });

      return;
    }

    // SIZE VALIDATION
    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {

      setErrors({
        ...errors,
        file: "Image must be below 5MB",
      });

      return;
    }

    setErrors({
      ...errors,
      file: "",
    });

   // setFile(selectedFile);
   setFile(selectedFile);

setPreview(
  URL.createObjectURL(selectedFile)
);
  };

  // VALIDATE FORM
  const validateForm = () => {

    let newErrors = {};

    const cleanName =
      formData.name.trim();

    const cleanBio =
      formData.bio.trim();

    // NAME
    if (!cleanName) {

      newErrors.name =
        "Name required";
    }

    else if (
      !/^[A-Za-z]/.test(cleanName)
    ) {

      newErrors.name =
        "Name must start with alphabet";
    }

    else if (
      cleanName.length < 3
    ) {

      newErrors.name =
        "Name too short";
    }

    // BIO
    if (cleanBio) {

      if (
        !/^[A-Za-z]/.test(cleanBio)
      ) {

        newErrors.bio =
          "Bio must start with alphabet";
      }

      else if (
        cleanBio.length < 10
      ) {

        newErrors.bio =
          "Bio too short";
      }

      else if (
        cleanBio.length > 300
      ) {

        newErrors.bio =
          "Bio too long";
      }
    }

    // SKILLS
    if (formData.skills.trim()) {

      const skillsArray =
        formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      const invalidSkill =
        skillsArray.some(
          (skill) =>
            !/^[A-Za-z][A-Za-z0-9\s#+.-]*$/.test(
              skill
            )
        );

      if (invalidSkill) {

        newErrors.skills =
          "Invalid skill format";
      }
    }

    return newErrors;
  };

  // DELETE PROFILE IMAGE
 

      const handleDeleteImage = async () => {

  try {

    const formDataToSend = new FormData();

    formDataToSend.append(
      "removeProfilePic",
      "true"
    );

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/update`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formDataToSend,
      }
    );

    const data = await res.json();

    console.log(data);

    await fetchProfile();
    setPreview("");

  } catch (err) {

    console.error(err);
  }
};
  // UPDATE PROFILE
  const handleUpdate = async () => {

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

      const formDataToSend =
        new FormData();

      formDataToSend.append(
        "name",
        formData.name.trim()
      );

      formDataToSend.append(
        "bio",
        formData.bio.trim()
      );

      const cleanedSkills =
        formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      formDataToSend.append(
        "skills",
        JSON.stringify(cleanedSkills)
      );

      if (file) {

        formDataToSend.append(
          "profilePic",
          file
        );
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/update`,
        {
          method: "PUT",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

     // const data = await res.json();

     // setUser(data);

     await res.json();

     await fetchProfile();

      setEditMode(false);

      setFile(null);
      setPreview("");

      setErrors({});

    } catch (err) {

      console.error(err);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (

    <div className="profile-container">

      <div className="profile-card">

        <h2>My Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="profile-img-wrapper">
         <img src={
  preview
    ? preview
    : user.profilePic
    ? `${import.meta.env.VITE_API_URL}/${user.profilePic}`
    : `https://ui-avatars.com/api/?name=${user.name}`
}
          
            className="profile-pic"
            alt="profile"
          />

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            id="fileInput"
            hidden
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
          />

          {/* EDIT ICON */}
          {editMode && (

            <label
              htmlFor="fileInput"
              className="edit-icon"
            >
              <Pencil size={16} />
            </label>
          )}

          {/* DELETE ICON */}
          {user.profilePic &&
            editMode && (

            <button
              type="button"
              className="delete-icon"
              onClick={handleDeleteImage}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* FILE ERROR */}
        {errors.file && (

         <p className="form-error">
            {errors.file}
          </p>
        )}

        {/* VIEW MODE */}
        {!editMode ? (

          <>
            <div className="profile-info">

              <p>
                <strong>Name:</strong>{" "}
                {user.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {user.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {user.role}
              </p>

              <p>
                <strong>Bio:</strong>{" "}
                {user.bio || "No bio added"}
              </p>

              <div className="skills">

                <strong>Skills:</strong>

                <div className="skill-tags">

                  {Array.isArray(user.skills) &&
                    user.skills.map(
                      (skill, i) => (

                      <span
                        key={i}
                        className="skill-chip"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <button
              className="edit-btn"
              onClick={() =>
                setEditMode(true)
              }
            >
              Edit
            </button>
          </>

        ) : (

          // EDIT MODE
          <div className="edit-form">

            {/* NAME */}
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />

            {errors.name && (
             <p className="form-error">
                {errors.name}
              </p>
            )}

            {/* BIO */}
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              maxLength={300}
            />

            {errors.bio && (
             <p className="form-error">
                {errors.bio}
              </p>
            )}

            {/* SKILLS */}
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
            />

            {errors.skills && (
              <p className="form-error">
                {errors.skills}
              </p>
            )}

            <div className="btn-group">

              <button type="button" onClick={handleUpdate}>
                Save
              </button>

              <button
                type="button"
                onClick={() => {

  setEditMode(false);

  setPreview("");

  setFile(null);
}}
              >
                Cancel
              </button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
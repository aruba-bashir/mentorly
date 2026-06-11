



 import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Webinars = () => {

  const { token, user } = useAuth();

  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState(null);

  // FORM STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [zoomLink, setZoomLink] = useState("");

  const [errors, setErrors] = useState({});

  // BAD WORDS
  const bannedWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "porn",
    "sex",
    "nude",
    "rape",
    "kill",
    "suicide",
  ];

  // FETCH WEBINARS
  const fetchWebinars = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/webinars`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setWebinars(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(
        "Error fetching webinars:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  // HANDLE INPUT CHANGE
  const handleInputChange = (
    field,
    value
  ) => {

    if (
      field === "title" ||
      field === "description"
    ) {

      // remove leading spaces
      value = value.replace(/^\s+/, "");

      // remove multiple spaces
      value = value.replace(/\s+/g, " ");

      // first char validation
      if (
        value.length === 1 &&
        !/^[A-Za-z]/.test(value)
      ) {
        return;
      }
    }

    if (field === "zoomLink") {

      value = value.trimStart();
    }

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "title") {
      setTitle(value);
    }

    if (field === "description") {
      setDescription(value);
    }

    if (field === "date") {
      setDate(value);
    }

    if (field === "zoomLink") {
      setZoomLink(value);
    }
  };

  // URL VALIDATION
  const isValidUrl = (url) => {

    try {

      const parsedUrl = new URL(url);

      return (
        parsedUrl.protocol === "http:" ||
        parsedUrl.protocol === "https:"
      );

    } catch {

      return false;
    }
  };

  // OPTIONAL:
  // ONLY ZOOM / GOOGLE MEET / TEAMS
  const isAllowedMeetingLink = (url) => {

    return (
      url.includes("zoom.us") ||
      url.includes("meet.google.com") ||
      url.includes("teams.microsoft.com")
    );
  };

  // VALIDATE
  const validateWebinar = () => {

    let newErrors = {};

    const cleanTitle =
      title.trim();

    const cleanDescription =
      description.trim();

    const cleanLink =
      zoomLink.trim();

    // TITLE
    if (!cleanTitle) {

      newErrors.title =
        "Title is required";
    }

    else if (
      !/^[A-Za-z]/.test(cleanTitle)
    ) {

      newErrors.title =
        "Title must start with alphabet";
    }

    else if (
      cleanTitle.length < 3
    ) {

      newErrors.title =
        "Minimum 3 characters required";
    }

    else if (
      cleanTitle.length > 100
    ) {

      newErrors.title =
        "Title too long";
    }

    // DESCRIPTION
    if (!cleanDescription) {

      newErrors.description =
        "Description is required";
    }

    else if (
      !/^[A-Za-z]/.test(
        cleanDescription
      )
    ) {

      newErrors.description =
        "Description must start with alphabet";
    }

    else if (
      cleanDescription.length < 10
    ) {

      newErrors.description =
        "Description too short";
    }

    else if (
      cleanDescription.length > 1000
    ) {

      newErrors.description =
        "Description too long";
    }

    // BAD WORD FILTER
    const lowerText =
      (
        cleanTitle +
        " " +
        cleanDescription
      ).toLowerCase();

    const containsBadWord =
      bannedWords.some((word) =>
        lowerText.includes(word)
      );

    if (containsBadWord) {

      newErrors.description =
        "Inappropriate content not allowed";
    }

    // DATE
    if (!date) {

      newErrors.date =
        "Date is required";
    }

    else {

      const selectedDate =
        new Date(date);

      const currentDate =
        new Date();

      if (
        !editingWebinar &&
        selectedDate < currentDate
      ) {

        newErrors.date =
          "Date must be future date";
      }
    }

    // LINK
    if (!cleanLink) {

      newErrors.zoomLink =
        "Meeting link required";
    }

    else if (
      !isValidUrl(cleanLink)
    ) {

      newErrors.zoomLink =
        "Enter valid URL";
    }

    else if (
      !isAllowedMeetingLink(
        cleanLink
      )
    ) {

      newErrors.zoomLink =
        "Only Zoom, Google Meet or Teams links allowed";
    }

    return newErrors;
  };

  // SAVE WEBINAR
  const handleSaveWebinar =
    async () => {

      const validationErrors =
        validateWebinar();

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {

        setErrors(validationErrors);

        return;
      }

      setErrors({});

      try {

        const url =
          editingWebinar
            ? `${import.meta.env.VITE_API_URL}/api/webinars/${editingWebinar._id}`
            : `${import.meta.env.VITE_API_URL}/api/webinars`;

        const method =
          editingWebinar
            ? "PUT"
            : "POST";

        const res = await fetch(
          url,
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              title:
                title.trim(),
              description:
                description.trim(),
              date,
              zoomLink:
                zoomLink.trim(),
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
              "Failed to save webinar"
          );

          return;
        }

        fetchWebinars();

        // RESET
        setShowModal(false);

        setEditingWebinar(null);

        setTitle("");
        setDescription("");
        setDate("");
        setZoomLink("");

        setErrors({});

      } catch (err) {

        console.error(err);

        alert(
          "Something went wrong"
        );
      }
    };

  // DELETE
  const handleDelete =
    async (id) => {

      

      try {

        const res =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/webinars/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!res.ok) {

          throw new Error(
            "Delete failed"
          );
        }

        fetchWebinars();

      } catch (err) {

        console.error(err);
      }
    };

  // CREATE ACCESS
  const canCreate =
    user?.role === "mentor" ||
    user?.role === "master";

  return (

    <div className="page-container">

      <h1 className="title">Webinars</h1>

      {canCreate && (

        <button
          className="btn btn-black"
          onClick={() =>
            setShowModal(true)
          }
        >
          + Create Webinar
        </button>
      )}

      {/* MODAL */}
      {showModal && (

         <div className="modal-overlay">
          <div className="card" style={{ width: "400px" }}>

            <h3>
              {editingWebinar
                ? "Edit"
                : "Create"}{" "}
              Webinar
            </h3>

            {/* TITLE */}
            <input
             className="form-input"
              placeholder="Title"
              value={title}
              maxLength={100}
              onChange={(e) =>
                handleInputChange(
                  "title",
                  e.target.value
                )
              }
            />

            {errors.title && (
              <p className="text-error">
                {errors.title}
              </p>
            )}

            {/* DESCRIPTION */}
            <textarea
                className="form-input"
              placeholder="Description"
              value={description}
              maxLength={1000}
              onChange={(e) =>
                handleInputChange(
                  "description",
                  e.target.value
                )
              }
            />

            {errors.description && (
              <p className="text-error">
                {errors.description}
              </p>
            )}

            <p className="text-muted">
              {
                description.trim()
                  .length
              }
              /1000
            </p>

            {/* DATE */}
            <input
              type="datetime-local"
              value={date}
              onChange={(e) =>
                handleInputChange(
                  "date",
                  e.target.value
                )
              }
            />

            {errors.date && (
              <p className="text-error">
                {errors.date}
              </p>
            )}

            {/* LINK */}
            <input
              className="form-input"
              placeholder="Zoom / Meet / Teams Link"
              value={zoomLink}
              onChange={(e) =>
                handleInputChange(
                  "zoomLink",
                  e.target.value
                )
              }
            />

            {errors.zoomLink && (
              <p className="text-error">
                {errors.zoomLink}
              </p>
            )}
          <div className="form-row">
            {/* BUTTONS */}
            <button
             className="btn btn-primary"
              onClick={
                handleSaveWebinar
              }
            >
              {editingWebinar
                ? "Update"
                : "Create"}
            </button>

            <button
             className="btn btn-outline"
              onClick={() => {

                setShowModal(false);

                setEditingWebinar(
                  null
                );

                setErrors({});
              }}
            >
              Cancel
            </button>

          </div>
        </div>
       </div>
      )
      }

      {/* LIST */}
      {loading ? (

        <p className="text-muted" >Loading...</p>

      ) : webinars.length === 0 ? (

        <p className="text-muted">No webinars yet</p>

      ) : (
      <div className="grid">
        {webinars.map((webinar) => {

          const isPast =
            new Date(
              webinar?.date
            ) < new Date();

          return (

            <div
              key={webinar?._id}
              className="card"
            >

              <h3>
                {webinar?.title ||
                  "Untitled Webinar"}
              </h3>

              <p
                className="text-muted"
              >
                {
                  webinar?.description
                }
              </p>

              <p
                className="text-muted">
                  Speaker:
               
                {webinar
                  ?.createdBy
                  ?.name ||
                  "Unknown"}
              </p>

              <p className="text-muted">
               
                  Date:
                {" "}
                {webinar?.date
                  ? new Date(
                      webinar.date
                    ).toLocaleString(
                      "en-US",
                      {
                        year:
                          "numeric",
                        month:
                          "short",
                        day: "numeric",
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                        hour12: true,
                      }
                    )
                  : "No date"}
              </p>

              {!isPast ? (

                <a
                  href={
                    webinar?.zoomLink
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Webinar
                </a>

              ) : (

                <span className="text-muted" >
                  Webinar Ended
                </span>
              )}

              {(user?.role ===
                "admin" ||
                webinar?.createdBy
                  ?._id ===
                  user?._id) && (

                <div className="form-row">

                  <button
                    className="btn btn-outline"
                    onClick={() => {

                      setEditingWebinar(
                        webinar
                      );

                      setTitle(
                        webinar?.title?.trim() ||
                          ""
                      );

                      setDescription(
                        webinar?.description?.trim() ||
                          ""
                      );

                      setDate(
                        webinar?.date
                          ?.slice(
                            0,
                            16
                          ) || ""
                      );

                      setZoomLink(
                        webinar?.zoomLink?.trim() ||
                          ""
                      );

                      setShowModal(
                        true
                      );
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-black"
                    onClick={() =>
                      handleDelete(
                        webinar._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>
              )}
            </div>
          );
        }
      )
    }
    </div>
)}
</div>
  );
}

  

export default Webinars;


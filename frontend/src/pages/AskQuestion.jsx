/*import { useState } from "react";
import { Navigate } from "react-router-dom";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  //if (!user) return <p>Loading...</p>;

  // safety check
  if (!user) return <p>Loading...</p>;

  const basePath = `/${user.role}`;

  //  Only MEMBER allowed
  if (user.role !== "member") {
    return <Navigate to={`${basePath}/qna`} />;
  }

  const handleSubmit = async () => {
    try {
      await fetch("http://localhost:5001/api/qna/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      //  redirect AFTER submit
      window.location.href = `${basePath}/qna`;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="qna-container">
      <h2>Ask a Question</h2>

      <input
        placeholder="Question title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Describe your problem"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>Post Question</button>
    </div>
  );
}

export default AskQuestion; */

import { useState } from "react";
import { Navigate } from "react-router-dom";

function AskQuestion() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>Loading...</p>;

  const basePath = `/${user.role}`;

  // MEMBER ONLY
  if (user.role !== "member") {
    return <Navigate to={`${basePath}/qna`} />;
  }

  // BAD WORDS
  const bannedWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "porn",
    "sex",
    "rape",
    "kill",
    "suicide",
  ];

  // HANDLE INPUT
  const handleInputChange = (
    field,
    value
  ) => {

    value = value.replace(/^\s+/, "");

    // PREVENT FIRST CHAR
    if (
      value.length === 1 &&
      !/^[A-Za-z]/.test(value)
    ) {
      return;
    }

    if (field === "title") {
      setTitle(value);
    }

    if (field === "description") {
      setDescription(value);
    }

    setErrors({
      ...errors,
      [field]: "",
    });
  };

  // VALIDATE
  const validateForm = () => {

    let newErrors = {};

    const cleanTitle = title.trim();

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
      cleanTitle.length < 5
    ) {

      newErrors.title =
        "Title too short";

    } else if (
      cleanTitle.length > 120
    ) {

      newErrors.title =
        "Title too long";
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

    } else if (
      cleanDescription.length > 1000
    ) {

      newErrors.description =
        "Description too long";
    }

    // BAD WORD FILTER
    const fullText =
      `${cleanTitle} ${cleanDescription}`
        .toLowerCase();

    const containsBadWord =
      bannedWords.some((word) =>
        fullText.includes(word)
      );

    if (containsBadWord) {

      newErrors.description =
        "Inappropriate language not allowed";
    }

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async () => {

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

      const res = await fetch(
        "http://localhost:5001/api/qna/questions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(
          data.message ||
            "Failed to post question"
        );

        return;
      }

      window.location.href =
        `${basePath}/qna`;

    } catch (err) {

      console.error(err);

      alert("Something went wrong");
    }
  };

  return (

   <div className="qna-container">
     <div className="qna-form">

      <h2>Ask a Question</h2>

      <input
        placeholder="Question title"
        value={title}
        maxLength={120}
        onChange={(e) =>
          handleInputChange(
            "title",
            e.target.value
          )
        }
      />

      {errors.title && (
        <p className="form-error">
          {errors.title}
        </p>
      )}

      <textarea
        placeholder="Describe your problem"
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
       <p className="form-error">
          {errors.description}
        </p>
      )}

     <p className="char-count">
  {description.trim().length}/1000
</p>

      <button onClick={handleSubmit}  className="qna-submit-btn">
        Post Question
      </button>

      </div>
    </div>
  
  );
}

export default AskQuestion;
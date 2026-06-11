

import { useState } from "react";
import axios from "axios";

function CreateUpdate({ fetchUpdates }) {

  const [content, setContent] = useState("");
  //const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});

  // BAD WORDS LIST
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

  // HANDLE CONTENT
  const handleContentChange = (value) => {

    // remove leading spaces
    value = value.replace(/^\s+/, "");

    // prevent first char as number/symbol
    if (
      value.length === 1 &&
      !/^[A-Za-z]/.test(value)
    ) {
      return;
    }

    setContent(value);

    setErrors({
      ...errors,
      content: "",
    });
  };

  // VALIDATE
  
  const validateForm = () => {

  let newErrors = {};

  const cleanContent = content.trim();

  if (!cleanContent) {

    newErrors.content =
      "Post content is required";

  } else if (
    !/^[A-Za-z]/.test(cleanContent)
  ) {

    newErrors.content =
      "Post must start with alphabet";

  } else if (
    cleanContent.length < 10
  ) {

    newErrors.content =
      "Post too short";

  } else if (
    cleanContent.length > 500
  ) {

    newErrors.content =
      "Post too long";
  }

  const lowerContent =
    cleanContent.toLowerCase();

  const containsBadWord =
    bannedWords.some((word) =>
      lowerContent.includes(word)
    );

  if (containsBadWord) {

    newErrors.content =
      "Inappropriate language not allowed";
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

      const data = {
  content: content.trim(),
};

      

      //if (image) {
     //   formData.append("image", image);
     // }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/updates`,
        data,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
           
          },
        }
      );

      setContent("");
      //setImage(null);

      setErrors({});

      fetchUpdates();

    } catch (err) {

      console.error(
        "Post error:",
        err.response?.data ||
          err.message
      );

      alert(
        err.response?.data?.message ||
          "Failed to create post"
      );
    }
  };

  return (

    <form onSubmit={handleSubmit}>

      {/* CONTENT */}
      <textarea
        className="form-input"
        placeholder="Share something..."
        value={content}
        maxLength={500}
        onChange={(e) =>
          handleContentChange(
            e.target.value
          )
        }
      />

      {errors.content && (
        <p className="text-error">
          {errors.content}
        </p>
      )}

      <p className="text-muted">
        {content.trim().length}/500
      </p>

     
      {/* BUTTON */}
      <button className="btn btn-black" type="submit">
        Post
      </button>

    </form>
  );
}


export default CreateUpdate;
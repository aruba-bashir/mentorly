
import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { Trash2 } from "lucide-react";


function QuestionDetail() {
 
  const { id } = useParams();

  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);

  const [text, setText] = useState("");

  const [errors, setErrors] =
    useState({});

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!user) return <p>Loading...</p>;

  const canAnswer =
    ["mentor", "master"]
      .includes(user.role);

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

  // FETCH
  const fetchAnswers = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/qna/answers/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      setAnswers(data);

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  // HANDLE INPUT
  const handleInputChange = (
    value
  ) => {

    value = value.replace(/^\s+/, "");

    if (
      value.length === 1 &&
      !/^[A-Za-z]/.test(value)
    ) {
      return;
    }

    setText(value);

    setErrors({
      ...errors,
      text: "",
    });
  };

  // VALIDATE
  const validateAnswer = () => {

    let newErrors = {};

    const cleanText = text.trim();

    if (!cleanText) {

      newErrors.text =
        "Answer required";

    } else if (
      !/^[A-Za-z]/.test(cleanText)
    ) {

      newErrors.text =
        "Answer must start with alphabet";

    } else if (
      cleanText.length < 5
    ) {

      newErrors.text =
        "Answer too short";

    } else if (
      cleanText.length > 1000
    ) {

      newErrors.text =
        "Answer too long";
    }

    // BAD WORDS
    const containsBadWord =
      bannedWords.some((word) =>
        cleanText
          .toLowerCase()
          .includes(word)
      );

    if (containsBadWord) {

      newErrors.text =
        "Inappropriate language not allowed";
    }

    return newErrors;
  };

  // SUBMIT ANSWER
  const handleAnswer = async () => {

    const validationErrors =
      validateAnswer();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {

      setErrors(validationErrors);

      return;
    }

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/qna/answers`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            text: text.trim(),
            questionId: id,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.message ||
            "Failed to submit answer"
        );

        return;
      }

      setText("");

      setErrors({});

      fetchAnswers();

    } catch (err) {

      console.error(err);

      alert("Something went wrong");
    }
  };

  // DELETE
  const handleDeleteAnswer =
    async (answerId) => {

      try {

        await fetch(
          `${import.meta.env.VITE_API_URL}/api/qna/answers/${answerId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchAnswers();

      } catch (err) {

        console.error(err);
      }
    };

  return (

          <div className="qna-container">
            <button
                  className="back-btn"
                  onClick={() => navigate(-1)}
                   >
                  ← Back
                   </button>
             <div className="answers-list">
               <h2>Answers</h2>

               {answers?.map((a) => (

                <div
                key={a._id}
               className="qna-card"
                >

              <p>{a.text}</p>

            <div className="answer-author">

            {a.user?.name}

            {a.user?.role ===
              "mentor" && (
              <span className="badge mentor">
                Mentor
              </span>
            )}

            {a.user?.role ===
              "master" && (
              <span className="badge master">
                Master
              </span>
            )}
           </div>

          {(
            (
              user._id ||
              user.id
            ) ===
              a.user?._id?.toString() ||

            user.role === "admin"
          ) && (

            <button
              className="delete-btn"
              onClick={() =>
                handleDeleteAnswer(
                  a._id
                )
              }
            >
              <Trash2 size={18} />
            </button>
          )}
    
       </div>

         ))}
 

      {/* ANSWER BOX */}
      {canAnswer && (
        <>

          <textarea
            placeholder="Write your answer..."
            value={text}
            maxLength={1000}
            onChange={(e) =>
              handleInputChange(
                e.target.value
              )
            }
          />

          {errors.text && (
            <p className="form-error">
              {errors.text}
            </p>
          )}

          <p className="char-count">
            {text.trim().length}/1000
          </p>

          <button onClick={handleAnswer}  className="qna-submit-btn">
            Submit Answer
          </button>
        </>
      )}
    </div>
    </div>
  );
}

export default QuestionDetail;
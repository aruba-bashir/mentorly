
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import "./QnA.css";

function QnA() {
  const [questions, setQuestions] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  //if (!user) return <p>Loading...</p>;

  if (!user) return <p>Loading...</p>;

  const basePath = `/${user.role}`;

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/qna/questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5001/api/qna/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="qna-container">
      <div className="qna-header">
        <h2>Q&A Community</h2>

        {user.role === "member" && (
          <Link to={`${basePath}/ask`} className="ask-btn">
            + Ask Question
          </Link>
        )}
      </div>

      <div className="qna-list">
        {questions.map((q) => (
          <Link
            to={`${basePath}/question/${q._id}`}
            key={q._id}
            className="qna-card"
          >
            <h3>{q.title}</h3>
            {/*<p>{q.description?.slice(0, 80)}...</p>*/}
            <p>
  {q.description?.length > 140
    ? q.description.slice(0, 140) + "..."
    : q.description}
</p>
            <div className="qna-meta">
              <span>
                {q.user?.name}

                {q.user?.role === "mentor" && (
                  <span className="badge mentor">Mentor</span>
                )}
                {q.user?.role === "master" && (
                  <span className="badge master">Master</span>
                )}
              </span>

              <span>
                {new Date(q.createdAt).toLocaleString()}
              </span>
            </div>

            {/*   DELETE */}
            {((user._id || user.id) === q.user?._id?.toString() ||
              user.role === "admin") && (
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(q._id, e)}
              >
                <Trash2 size={18} />
              </button>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QnA;
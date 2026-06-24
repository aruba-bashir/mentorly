import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { User, HelpCircle, MessageSquare, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // use context instead of localStorage
  const { user, token, loading } = useAuth();

  const [recent, setRecent] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [stats, setStats] = useState({
  questions: 0,
  answers: 0,
 
});

  //  handle loading properly
  if (loading) return <p>Loading...</p>;
  if (!user) return null;
 
   if (user.role === "admin") {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome back, {user.name}</p>

    
      {/* ONLY WORKING FEATURE */}
      <div className="card actions">
        <h3>Admin Controls</h3>

        <div className="action-buttons">
          <button onClick={() => navigate("/admin/users")}>
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}

  const basePath = `/${user.role}`;

  const fetchStats = async () => {
    try {
      const userId = user._id || user.id;

      // fetch questions
      const qRes = await fetch(`${import.meta.env.VITE_API_URL}/api/qna/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const questions = await qRes.json();

      // fetch answers
      const aRes = await fetch(`${import.meta.env.VITE_API_URL}/api/qna/answers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const answers = await aRes.json();

      // filter user data
      const myQuestions = questions.filter(
        (q) => q.user?._id?.toString() === userId
      );

      const myAnswers = answers.filter(
        (a) => (a.user?._id || a.user)?.toString() === userId
      );

      setStats({
        questions: myQuestions.length,
        answers: myAnswers.length,
      });
      
      // recent activity
      if (user.role === "member") {
        setRecent(myQuestions.slice(0, 3));
      } else {
        setRecent(myAnswers.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
      
    }
  };

 const fetchRecommendations = async () => {
  try {
    const [jobsRes, internshipsRes] = await Promise.all([
      fetch(
        `${import.meta.env.VITE_API_URL}/api/recommendations/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/recommendations/internships`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    ]);

    const jobs = await jobsRes.json();
    const internships = await internshipsRes.json();

    setRecommendedJobs(jobs.slice(0, 3));
    setRecommendedInternships(internships.slice(0, 3));

  } catch (err) {
    console.error(err);
     
  }
};


  
  useEffect(() => {
    if (user && token) {
      fetchStats();
      fetchRecommendations();
    }
  }, [user, token]); //  dependency fix

  return (
    <div className="dashboard">
      {/* HEADER *
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.name}</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {user.role === "member" && (
          <div className="card stat green">
            <HelpCircle size={28} />
            <div>
              <h2>{stats.questions}</h2>
              <p>Questions Asked</p>
            </div>
          </div>
        )}

        {(user.role === "mentor" || user.role === "master") && (
          <div className="card stat blue">
            <MessageSquare size={28} />
            <div>
              <h2>{stats.answers}</h2>
              <p>Answers Given</p>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="card actions">
        <h3>
          <Activity size={18} /> Quick Actions
        </h3>

        <div className="action-buttons">
          {user.role === "member" && (
            <button onClick={() => navigate(`${basePath}/ask`)}>
              <HelpCircle size={16} /> Ask Question
            </button>
          )}

          <button onClick={() => navigate(`${basePath}/qna`)}>
            <MessageSquare size={16} /> View Q&A
          </button>

          <button onClick={() => navigate(`${basePath}/profile`)}>
            <User size={16} /> Profile
          </button>
        </div>
      </div>

      {/* RECENT */}
      <div className="card recent">
        <h3>
          <Activity size={18} /> Recent Activity
        </h3>

        {recent.length === 0 ? (
          <p className="empty">No activity yet</p>
        ) : (
          recent.map((item, i) => (
            <Link
           key={i}
          to={`${basePath}/question/${
          user.role === "member"
          ? item._id
           : item.question
           }`}
           className="recent-item"
          >
         {user.role === "member"
        ? item.title
        : item.text.length > 120
        ? item.text.slice(0, 120) + "..."
        : item.text}
       </Link>
          ))
        )}
      </div>
      <div className="card recent">
  <h3>Recommended Jobs</h3>

  {recommendedJobs.length === 0 ? (
    <p className="empty">
      No recommendations available
    </p>
  ) : (
    recommendedJobs.map((job) => (
  <Link
  key={job._id}
  to={`${basePath}/jobs`}
  className="recent-item"
>
 <div style={{ display: "flex", justifyContent: "space-between" }}>
  <strong>{job.title}</strong>

  {job.source === "external" && (
    <span className="external-badge">
      External
    </span>
  )}
</div>

<small>{job.location}</small>
 
</Link>
    ))
    
  )}
  <div style={{ marginTop: "12px" }}>
  <Link to={`${basePath}/jobs`}>
    View All Jobs →
  </Link>
</div>
</div>


 <div className="card recent">
  <h3>Recommended Internships</h3>

  {recommendedInternships.length === 0 ? (
    <p className="empty">
      No recommendations available
    </p>
  ) : (
    recommendedInternships.map((internship) => (
     <Link
  key={internship._id}
  to={`${basePath}/internships`}
  className="recent-item"
>
  <div style={{ display: "flex", justifyContent: "space-between" }}>
  <strong>{internship.title}</strong>

  {internship.source === "external" && (
    <span className="external-badge">
      External
    </span>
  )}
</div>

<small>{internship.location}</small>
</Link>
    ))
  )}

<div style={{ marginTop: "12px" }}>
  <Link to={`${basePath}/internships`}>
    View All Internships →
  </Link>
</div>

</div>
</div>
  );
}

export default Dashboard;



     
    

         
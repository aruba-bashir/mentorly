import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page-container about-page">

      <div className="about-header">
        <h1>About Mentorly</h1>
        <p className="text-muted">
          A platform built to connect students with real opportunities, guidance, and growth.
        </p>
      </div>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p className="text-muted">
          Mentorly exists to bridge the gap between students and the industry.
          We believe every learner deserves access to mentorship, real-world exposure,
          and meaningful career opportunities.
        </p>
      </div>

      <div className="about-section">
        <h2>What We Do</h2>
        <ul className="about-list">
          <li>Connect students with mentors</li>
          <li>Provide internship opportunities</li>
          <li>Share tech updates and webinars</li>
          <li>Build a supportive learning community</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Why Mentorly?</h2>
        <p className="text-muted">
          Most students struggle with direction. Mentorly simplifies that journey
          by bringing everything — mentorship, opportunities, and learning — into one place.
        </p>
      </div>

      <div className="about-cta">
        <button className="btn btn-black" onClick={() => navigate("/signup")}>
          Get Started
        </button>

        <button className="btn btn-outline" onClick={() => navigate("/")}>
          Back to Home
        </button>

        


      </div>

    </div>
  );
}
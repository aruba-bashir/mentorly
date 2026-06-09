
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Brand from "./Brand";
export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
   const notes = [
  {
    text: "We built Mentorly to simplify mentorship and career guidance for students.",
    author: "~ INSHA MANZOOR..",
  },
  {
    text: "More than a project, Mentorly is our attempt to turn confusion into clarity for learners everywhere.",
    author: "~ HAMIZA TARIQ..",
  },
  {
    text: "This platform isn’t a showcase—it’s the emotion every learner across the world has quietly been longing for.",
    author: "~ ARUBA BASHIR..",
  },
];

const [index, setIndex] = useState(0);
  if (loading) {
    return (
      <div className="page-container">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="page-container home-page">
      <div className="topbar">
  <div className="brand-wrap">
    <h1 className="brand-logo">Mentorly</h1>
    <span className="brand-tagline">career growth platform</span>
  </div>
</div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
  Built for students, mentors & career growth
</div>
          <h1 className="hero-title">
  Find the right mentor to{" "}
  <span className="hero-highlight">accelerate</span> your career
</h1>
          <p className="text-muted hero-subtitle">
            Mentorly connects students and professionals with mentors,
            internships, webinars, and career opportunities — all in one place.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-black"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>

            <button
              className="btn btn-outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* OBJECTIVES SECTION */}
      <section className="section-spacing">
        <h2 className="title section-title">Why Mentorly? </h2>

        <div className="grid feature-grid">
          <div className="card">
            <h3>Mentorship</h3>
            <p className="text-muted">
              Connect with experienced mentors for career guidance and learning.
            </p>
          </div>

          <div className="card">
            <h3>Internships</h3>
            <p className="text-muted">
              Discover internship opportunities tailored for students and freshers.
            </p>
          </div>

          <div className="card">
            <h3>Career Growth</h3>
            <p className="text-muted">
              Build skills, attend webinars, and prepare for industry success.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section-spacing">
        <h2 className="title section-title">Platform Features</h2>

        <div className="grid feature-grid">
          <div className="card">
            <h3>Updates</h3>
            <p className="text-muted">
               Explore trending technologies, industry news, and insights from the tech world.
             </p>
        </div>
          <div className="card">
            <h3>Webinars</h3>
            <p className="text-muted">
              Join webinars and learn directly from professionals.
            </p>
          </div>

          <div className="card">
            <h3>Q&A Community</h3>
            <p className="text-muted">
              Ask questions, share knowledge, and learn together with the Mentorly community.
            </p>
          </div>
        </div>
      </section>

      {/*team section */}
      <section className="section-spacing">
  <h2 className="title section-title">From Our Team</h2>

  <div className="carousel">

    <button
      className="arrow-btn"
      onClick={() =>
        setIndex((i) => (i - 1 + notes.length) % notes.length)
      }
    >
      ‹
    </button>

    <div className="note-card">
      <p className="note-text">“{notes[index].text}”</p>
      <span className="note-author">{notes[index].author}</span>
    </div>

    <button
      className="arrow-btn"
      onClick={() => setIndex((i) => (i + 1) % notes.length)}
    >
      ›
    </button>

  </div>
</section>
<section className="section-spacing">

  <div className="connect-mini-card">

    <h3>Connect With Us</h3>
    <p className="text-muted">
      Stay connected with Mentorly updates and opportunities.
    </p>

    <div className="social-row">

      <a
        href="https://www.linkedin.com/in/mentorly-platform-813b24413"
        target="_blank"
        rel="noreferrer"
        className="social-box"
      >
        <FaLinkedin size={18} />
        <span>LinkedIn</span>
      </a>

      <a
        href="https://x.com/Mentorly_app"
        target="_blank"
        rel="noreferrer"
        className="social-box"
      >
        <FaXTwitter size={18} />
        <span>X</span>
      </a>

    </div>

  </div>

</section>
      {/* FOOTER */}
     <footer className="footer">

  <div>
    <Brand /> 
    <p className="text-muted">
      Empowering students through mentorship and opportunities.
    </p>

    <p className="copyright">
      © {new Date().getFullYear()} Mentorly. All rights reserved.
    </p>
  </div>

  {/* NAV LINKS */}
  <div className="footer-links">
    <span className="footer-link" onClick={() => navigate("/about")}>
      About Us
    </span>
  </div>

 
  

</footer>
    </div>
  );
}
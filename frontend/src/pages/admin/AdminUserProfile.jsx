import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Profile.css";

function AdminUserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">

      <button
        className="back-btn"
        onClick={() => navigate("/admin/users")}
      >
        ← Users
      </button>

      <div className="profile-card">

        <h2>User Profile</h2>

        <div className="profile-img-wrapper">
          <img
            src={
              user.profilePic
                ? `${import.meta.env.VITE_API_URL}/${user.profilePic}`
                : `https://ui-avatars.com/api/?name=${user.name}`
            }
            className="profile-pic"
            alt="profile"
          />
        </div>

        <div className="profile-info">

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>

          <p>
            <strong>Email Verified:</strong>{" "}
            {user.isVerified ? "Yes" : "No"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {user.isBlocked ? "Blocked" : "Active"}
          </p>

          <p>
            <strong>Bio:</strong>{" "}
            {user.bio || "No bio added"}
          </p>

          <div className="skills">

            <strong>Skills:</strong>

            <div className="skill-tags">
              {Array.isArray(user.skills) &&
              user.skills.length > 0 ? (
                user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="skill-chip"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills added</p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminUserProfile;
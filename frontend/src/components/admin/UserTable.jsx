

import React from "react";

import { useNavigate } from "react-router-dom";

const UserTable = ({ users, onDelete, onToggleBlock }) => {
    const navigate = useNavigate();
  return (
    <div className="grid">

      {users.map((user) => (
        <div key={user._id} className="card">

          {/* HEADER */}
          <h3>{user.name}</h3>

          <p className="text-muted">
            <b>Email:</b> {user.email}
          </p>

          {/* ROLE BADGE */}
          <p>
            <b>Role:</b>{" "}
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "8px",
                background: "#eef2ff",
                color: "#4f46e5",
                fontSize: "12px",
              }}
            >
              {user.role}
            </span>
          </p>

          {/* STATUS BADGE */}
          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "8px",
                background: user.isBlocked ? "#fee2e2" : "#dcfce7",
                color: user.isBlocked ? "#dc2626" : "#16a34a",
                fontSize: "12px",
              }}
            >
              {user.isBlocked ? "Blocked" : "Active"}
            </span>
          </p>

          {/* ACTIONS */}
          <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>

            <button
              className="btn btn-outline"
              onClick={() => onToggleBlock(user._id)}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </button>

            <button
              className="btn btn-black"
              onClick={() => onDelete(user._id)}
            >
              Delete
            </button>

            <button
  className="btn btn-outline"
  onClick={() =>
    navigate(`/admin/user/${user._id}`)
  }
>
  View Profile
</button>
          </div>

        </div>
      ))}

    </div>
  );
};

export default UserTable;
/*import React from "react";

const UserTable = ({ users, onDelete, onToggleBlock }) => {
  return (
    <table border="1" cellPadding="10" width="100%">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>

           <td>
  <span
    style={{
      padding: "3px 8px",
      borderRadius: "5px",
      fontWeight: "500",
      color: "#333",
      background:
        user.role === "admin"
          ? "#ffdddd"
          : user.role === "mentor"
          ? "#ddf0ff"
          : user.role === "master"
          ? "#ffe9b3"
          : user.role === "member"
          ? "#e6ffe6"
          : "#eee",
    }}
  >
    {user.role}
  </span>
</td>

            <td>
              {user.isBlocked ? (
                <span style={{ color: "red" }}>Blocked</span>
              ) : (
                <span style={{ color: "green" }}>Active</span>
              )}
            </td>

            <td>
              <button onClick={() => onToggleBlock(user._id)}>
                {user.isBlocked ? "Unblock" : "Block"}
              </button>

              <button
                onClick={() => onDelete(user._id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable; */

import React from "react";

const UserTable = ({ users, onDelete, onToggleBlock }) => {
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

          </div>

        </div>
      ))}

    </div>
  );
};

export default UserTable;
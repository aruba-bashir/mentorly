
import React from "react";

const UserStats = ({ users }) => {
  const total = users.length;
  const blocked = users.filter((u) => u.isBlocked).length;
  const active = total - blocked;

  const rolesCount = {
    member: users.filter((u) => u.role === "member").length,
    mentor: users.filter((u) => u.role === "mentor").length,
    master: users.filter((u) => u.role === "master").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div style={{ marginBottom: "20px" }}>

      {/* SYSTEM STATS */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <StatCard title="Total Users" value={total} color="#6366f1" />
        <StatCard title="Active" value={active} color="#16a34a" />
        <StatCard title="Blocked" value={blocked} color="#dc2626" />
      </div>

      {/* ROLE STATS */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
        <StatCard title="Admins" value={rolesCount.admin} color="#111827" />
        <StatCard title="Masters" value={rolesCount.master} color="#7c3aed" />
        <StatCard title="Mentors" value={rolesCount.mentor} color="#0ea5e9" />
        <StatCard title="Members" value={rolesCount.member} color="#64748b" />
      </div>

    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div
    style={{
      padding: "14px 16px",
      borderRadius: "12px",
      background: "#fff",
      minWidth: "140px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      borderLeft: `4px solid ${color}`,
    }}
  >
    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
      {title}
    </p>
    <h2 style={{ margin: "6px 0 0 0", fontSize: "22px" }}>
      {value}
    </h2>
  </div>
);

export default UserStats;
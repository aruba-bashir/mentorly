import React, { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  toggleBlockUser,
} from "../../services/userService";

import UserStats from "../../components/admin/UserStats";
import UserTable from "../../components/admin/UserTable";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  const handleToggleBlock = async (id) => {
    await toggleBlockUser(id);
    loadUsers();
  };

  if (loading) return <h2>Loading users...</h2>;

  /*return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard - Manage Users</h2>

      {/* STATS *
      <UserStats users={users} />

      {/* TABLE *
      <UserTable
        users={users}
        onDelete={handleDelete}
        onToggleBlock={handleToggleBlock}
      />
    </div>
  ); */
  return (
  <div className="page-container">

    <h2 className="title">Admin Dashboard - Manage Users</h2>

    {/* LOADING */}
    {loading ? (
      <p className="text-muted">Loading users...</p>
    ) : (
      <>
        {/* STATS */}
        <UserStats users={users} />

        {/* TABLE */}
        <UserTable
          users={users}
          onDelete={handleDelete}
          onToggleBlock={handleToggleBlock}
        />
      </>
    )}

  </div>
);
};

export default AdminUsers;
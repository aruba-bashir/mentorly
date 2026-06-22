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
  const [search, setSearch] = useState("");


  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };
 const filteredUsers = users.filter(
  (user) =>
    (user.name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (user.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
);
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

  
  return (
  <div className="page-container">

    <h2 className="title">Admin Dashboard - Manage Users</h2>
     <input
  type="text"
  placeholder="Search by name or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>
    {/* LOADING */}
    {loading ? (
      <p className="text-muted">Loading users...</p>
    ) : (
      <>
        {/* STATS */}
        <UserStats users={users} />

        {/* TABLE */}
        <UserTable
          users={filteredUsers}
          onDelete={handleDelete}
          onToggleBlock={handleToggleBlock}
          onViewProfile={setSelectedUser}
        />

       

    

      </>
    )}

  </div>
);
};

export default AdminUsers;
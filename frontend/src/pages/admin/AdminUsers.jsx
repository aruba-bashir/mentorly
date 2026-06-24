import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import {
  getUsers,
  deleteUser,
  toggleBlockUser,
  approveUser,
} from "../../services/userService";

import UserStats from "../../components/admin/UserStats";
import UserTable from "../../components/admin/UserTable";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);

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

  /*const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  }; */
  const handleDelete = async (id) => {
  try {
    await deleteUser(id);
    toast.success("User deleted successfully");
    loadUsers();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Delete failed");
  }
};
  /*const handleToggleBlock = async (id) => {
    await toggleBlockUser(id);
    loadUsers();
  }; */
  const handleToggleBlock = async (id) => {
  try {
    await toggleBlockUser(id);
    toast.success("User status updated");
    loadUsers();
  } catch (err) {
    toast.error("Failed to update user status");
  }
};

  /* const handleApprove = async (id) => {
  await approveUser(id);
  loadUsers();
};*/

const handleApprove = async (id) => {
  try {
    await approveUser(id);
    toast.success("User approved");
    loadUsers();
  } catch (err) {
    toast.error("Approval failed");
  }
};

 // if (loading) return <h2>Loading users...</h2>;

  
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
          onDelete={(id) => {
  setSelectedUserId(id);
  setShowDeleteModal(true);
}}
          onToggleBlock={handleToggleBlock}
          onApprove={handleApprove}
        />



      </>
    )}
    <ConfirmModal
  show={showDeleteModal}
  title="Delete User"
  message="Are you sure you want to delete this user?"
  confirmText="Delete"
  onClose={() => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  }}
  onConfirm={async () => {
    await handleDelete(selectedUserId);
    setShowDeleteModal(false);
    setSelectedUserId(null);
  }}
/>

  </div>
);
};

export default AdminUsers;
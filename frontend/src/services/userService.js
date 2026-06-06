const API = "http://localhost:5001/api/admin/users";

export const getUsers = async () => {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
};

export const toggleBlockUser = async (id) => {
  const res = await fetch(`${API}/${id}/block`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  return res.json();
};
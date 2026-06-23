const API = 
  `${import.meta.env.VITE_API_URL}/api/admin/users`;

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
export const approveUser = async (id) => {
  const res = await fetch(
    `${API}/${id}/approve`,
    {
      method: "PATCH",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to approve user"
    );
  }

  return res.json();
};
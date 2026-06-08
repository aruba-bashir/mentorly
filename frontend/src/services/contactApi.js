const API_BASE = "https://mentorly-backend-9x4x.onrender.com/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// INCOMING REQUESTS
export const getIncomingRequests = async () => {
  const res = await fetch(`${API_BASE}/contact-requests/incoming`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

// RESPOND TO REQUEST
export const respondToRequest = async (requestId, status) => {
  const res = await fetch(
    `${API_BASE}/contact-requests/respond/${requestId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }), // accepted | rejected
    }
  );
  return res.json();
};

// MY CONNECTIONS
export const getMyConnections = async () => {
  const res = await fetch(`${API_BASE}/connections`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};
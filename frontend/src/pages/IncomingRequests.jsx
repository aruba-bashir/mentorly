
import { useEffect, useState } from "react";
import {
  getIncomingRequests,
  respondToRequest,
} from "../services/contactApi";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getIncomingRequests();

      //  ALWAYS extract array
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (id, status) => {
    await respondToRequest(id, status);
    fetchRequests(); // refresh list
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Incoming Requests</h2>

      {requests.length === 0 && <p>No requests</p>}

      {requests.map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}
        >
          <p>
            <b>{req.sender.name}</b> ({req.sender.role})
          </p>

          <button onClick={() => handleResponse(req._id, "accepted")}>
            Accept
          </button>

          <button
            onClick={() => handleResponse(req._id, "rejected")}
            style={{ marginLeft: 10 }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
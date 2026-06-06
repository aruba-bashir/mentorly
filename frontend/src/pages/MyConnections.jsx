import { useEffect, useState } from "react";
import { getMyConnections } from "../services/contactApi";

export default function MyConnections() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    getMyConnections().then((data) =>
      setConnections(data.connections || [])
    );
  }, []);

  return (
    <div>
      <h2>My Connections</h2>

      {connections.length === 0 && <p>No connections yet</p>}

      {connections.map((user) => (
        <div key={user._id} style={{ border: "1px solid #ddd", padding: 8, margin: 8 }}>
          <p><b>{user.name}</b></p>
          <p>{user.role}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
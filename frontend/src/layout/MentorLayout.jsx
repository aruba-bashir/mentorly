import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function MentorLayout({ children }) {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role={user.role} />

      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

export default MentorLayout;
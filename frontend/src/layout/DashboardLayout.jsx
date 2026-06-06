
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ role }) {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />

      <div className="dashboard-content">
        <Outlet /> {/*  THIS IS KEY */}
      </div>
    </div>
  );
}

export default DashboardLayout;
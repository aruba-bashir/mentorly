
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";

import Brand from "../pages/Brand";

import {
  memberMenu,
  mentorMenu,
  masterMenu,
  adminMenu,
} from "../config/sidebarMenus";

import { useAuth } from "../context/AuthContext"; 

export default function Sidebar({ role }) {
  let menu = [];

  const { logout } = useAuth(); 
  const navigate = useNavigate(); 

  if (role === "admin")  menu = adminMenu;
  if (role === "member") menu = memberMenu;
  if (role === "mentor") menu = mentorMenu;
  if (role === "master") menu = masterMenu;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); // VERY IMPORTANT
    navigate("/login");
  };

  return (
    <aside className="sidebar">
     <Brand />

      <nav>
        {menu.map((item) => (
        //  <Link key={item.path} to={item.path}>
        <NavLink
  key={item.path}
  to={item.path}
  className={({ isActive }) => isActive ? "active" : ""}
>
            {item.name}
       
        </NavLink>
        ))}
      </nav>

      {/*  LOGOUT SECTION */}
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
}
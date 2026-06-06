
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Mentorly</Link>

      <div style={styles.links}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 60px",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#4f46e5",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "25px",
  },
};




export default Navbar;

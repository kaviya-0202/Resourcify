import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={s.nav}>
      <Link to="/home" style={s.brand}>
        <span style={s.brandIcon}>📚</span>
        <span style={s.brandText}>Resourcify</span>
      </Link>

      <div style={s.links}>
        <Link to="/home" style={s.link}>Home</Link>
        <Link to="/downloads" style={s.link}>Browse</Link>
        <Link to="/upload" style={s.link}> Upload</Link>
        <Link to="/contact" style={s.link}>Contact</Link>
      </div>

      <div style={s.userArea}>
        <div style={s.userInfo} onClick={() => navigate("/profile")} 
  title="View Profile">
  <div style={{...s.avatar, cursor: "pointer"}}>{user?.name?.[0]?.toUpperCase()}</div>
  <div style={{ cursor: "pointer" }}>
    <div style={s.userName}>{user?.name}</div>
    <div style={s.userRole}>{user?.role} • {user?.department}</div>
  </div>
</div>
        <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: "64px",
    background: "rgba(26,29,46,0.95)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100,
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  brandIcon: { fontSize: "22px" },
  brandText: { fontFamily: "'DM Serif Display', serif", fontSize: "20px", color: "var(--accent)" },
  links: { display: "flex", gap: "8px", alignItems: "center" },
  link: {
    padding: "7px 14px", borderRadius: "8px", color: "var(--text2)",
    fontSize: "14px", fontWeight: "500",
  },
  userArea: { display: "flex", alignItems: "center", gap: "16px" },
  userInfo: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "15px",
  },
  userName: { fontSize: "14px", fontWeight: "600", lineHeight: "1.2" },
  userRole: { fontSize: "11px", color: "var(--text2)", textTransform: "capitalize" },
  logoutBtn: {
    padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--border)",
    background: "transparent", color: "var(--text2)", fontSize: "13px", cursor: "pointer",
  },
};

export default Navbar;
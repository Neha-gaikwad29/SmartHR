
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🧰</span>
        <h2>HR Manager</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-link">
          <span>🏠</span> Dashboard
        </NavLink>

        <NavLink to="/employees" className="nav-link">
          <span>👥</span> Employees
        </NavLink>

        <NavLink to="/leaves" className="nav-link">
          <span>📅</span> Leave Management
        </NavLink>

        <NavLink to="/attendance" className="nav-link">
          <span>📊</span> Attendance
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-settings">⚙ Settings</div>
        <div className="sidebar-logout">↪ Logout</div>
      </div>
    </aside>
  );
}

export default Sidebar;

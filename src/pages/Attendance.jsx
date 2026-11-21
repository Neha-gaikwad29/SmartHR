
import { useState } from "react";

function Attendance({ employees = [], updateAttendance }) {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const present = employees.filter(
    (emp) => emp.attendanceStatus === "Present"
  ).length;

  const absent = employees.filter(
    (emp) => emp.attendanceStatus === "Absent"
  ).length;

  const late = employees.filter(
    (emp) => emp.attendanceStatus === "Late"
  ).length;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Manage and track employee attendance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Present</h3>
          <h2>{present}</h2>
        </div>

        <div className="stat-card">
          <h3>Absent</h3>
          <h2>{absent}</h2>
        </div>

        <div className="stat-card">
          <h3>Late</h3>
          <h2>{late}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Employees</h3>
          <h2>{employees.length}</h2>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Employee Attendance</h2>

        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="attendance-search"
        />

        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Attendance Status</th>
                <th>Mark Attendance</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>
                    <span className={`attendance-status ${
                      (emp.attendanceStatus || "Not Marked")
                        .toLowerCase().replace(" ", "-")
                    }`}>
                      {emp.attendanceStatus || "Not Marked"}
                    </span>
                  </td>

                  <td>
                    <select
                      value={emp.attendanceStatus || "Not Marked"}
                      onChange={(e) =>
                        updateAttendance(emp.id, e.target.value)
                      }
                    >
                      <option value="Not Marked">Not Marked</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="4">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;

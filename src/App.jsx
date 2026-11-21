import React, { useState, useEffect } from "react";
import "./style.css";

const initialEmployees = [
  {
    id: 1,
    name: "Rahul Mehta",
    email: "rahul@gmail.com",
    department: "Development",
    position: "Developer",
    salary: 35000
  },
  {
    id: 2,
    name: "Sneha Patil",
    email: "sneha@gmail.com",
    department: "Design",
    position: "UI Designer",
    salary: 30000
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit@gmail.com",
    department: "Finance",
    position: "Accountant",
    salary: 28000
  }
];

const initialLeaves = [
  {
    id: 1,
    name: "Priya Sharma",
    type: "Casual Leave",
    from: "2026-11-20",
    to: "2026-11-21",
    reason: "Personal Work",
    status: "Pending"
  },
  {
    id: 2,
    name: "Rahul Mehta",
    type: "Sick Leave",
    from: "2026-11-18",
    to: "2026-11-19",
    reason: "Health Issue",
    status: "Approved"
  },
  {
    id: 3,
    name: "Sneha Patil",
    type: "Annual Leave",
    from: "2026-11-22",
    to: "2026-11-24",
    reason: "Family Trip",
    status: "Pending"
  }
];

const initialAttendance = [
  { id: 1, name: "Rahul Mehta", department: "Development", status: "Present" },
  { id: 2, name: "Sneha Patil", department: "Design", status: "Late" },
  { id: 3, name: "Amit Verma", department: "Finance", status: "Absent" }
];

function App() {
  const [page, setPage] = useState("Dashboard");

  const [employees, setEmployees] = useState(() =>
    JSON.parse(localStorage.getItem("hrEmployees")) || initialEmployees
  );

  const [leaves, setLeaves] = useState(() =>
    JSON.parse(localStorage.getItem("hrLeaves")) || initialLeaves
  );

  const [attendance, setAttendance] = useState(() =>
    JSON.parse(localStorage.getItem("hrAttendance")) || initialAttendance
  );

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const [search, setSearch] = useState("");

  const emptyEmployee = {
    name: "",
    email: "",
    department: "",
    position: "",
    salary: ""
  };

  const [form, setForm] = useState(emptyEmployee);

  const [leaveForm, setLeaveForm] = useState({
    name: "",
    type: "Casual Leave",
    from: "",
    to: "",
    reason: ""
  });

  useEffect(() => {
    localStorage.setItem("hrEmployees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("hrLeaves", JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem("hrAttendance", JSON.stringify(attendance));
  }, [attendance]);

  const totalSalary = employees.reduce(
    (sum, employee) => sum + Number(employee.salary || 0), 0
  );

  const activeEmployees = employees.length;

  const pendingLeaves = leaves.filter(
    leave => leave.status === "Pending"
  ).length;

  function openAddEmployee() {
    setEditingEmployee(null);
    setForm(emptyEmployee);
    setShowEmployeeForm(true);
  }

  function openEditEmployee(employee) {
    setEditingEmployee(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary
    });
    setShowEmployeeForm(true);
  }

  function saveEmployee(e) {
    e.preventDefault();

    if (editingEmployee) {
      setEmployees(employees.map(employee =>
        employee.id === editingEmployee.id
          ? { ...employee, ...form, salary: Number(form.salary) }
          : employee
      ));
    } else {
      setEmployees([
        ...employees,
        {
          id: Date.now(),
          ...form,
          salary: Number(form.salary)
        }
      ]);

      setAttendance([
        ...attendance,
        {
          id: Date.now(),
          name: form.name,
          department: form.department,
          status: "Not Marked"
        }
      ]);
    }

    setShowEmployeeForm(false);
    setForm(emptyEmployee);
    setEditingEmployee(null);
  }

  function deleteEmployee(id) {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(employee => employee.id !== id));
      setAttendance(attendance.filter(item => item.id !== id));
    }
  }

  function openProfile(employee) {
    setSelectedEmployee(employee);
    setShowProfile(true);
  }

  function saveLeave(e) {
    e.preventDefault();

    setLeaves([
      ...leaves,
      {
        id: Date.now(),
        ...leaveForm,
        status: "Pending"
      }
    ]);

    setLeaveForm({
      name: "",
      type: "Casual Leave",
      from: "",
      to: "",
      reason: ""
    });

    setShowLeaveForm(false);
  }

  function updateLeave(id, status) {
    setLeaves(leaves.map(leave =>
      leave.id === id ? { ...leave, status } : leave
    ));
  }

  function updateAttendance(id, status) {
    setAttendance(attendance.map(item =>
      item.id === id ? { ...item, status } : item
    ));
  }

  const filteredEmployees = employees.filter(employee =>
    `${employee.name} ${employee.email} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredLeaves = leaves.filter(leave =>
    leave.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAttendance = attendance.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = attendance.filter(
    item => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    item => item.status === "Absent"
  ).length;

  const lateCount = attendance.filter(
    item => item.status === "Late"
  ).length;

  function StatCard({ title, value, icon }) {
    return (
      <div className="stat-card">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    );
  }

  function Status({ value }) {
    return (
      <span className={`status ${value.toLowerCase().replace(" ", "-")}`}>
        {value}
      </span>
    );
  }

  return (
    <div className="app-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="logo">💼 HR Manager</div>

        <nav>
          {[
            ["Dashboard", "🏠"],
            ["Employee Management", "👥"],
            ["Leave Management", "📅"],
            ["Attendance", "📊"],
            ["Salary & Payroll", "💰"]
          ].map(([name, icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                setSearch("");
              }}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>⚙️ Settings</p>
          <p>↪ Logout</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="topbar">
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="user-info">
            👤 Neha Gaikwad
          </div>
        </header>

        {/* DASHBOARD */}

        {page === "Dashboard" && (
          <>
            <div className="page-header">
              <h1>HR Management Dashboard</h1>
              <p>Streamlining workforce management and employee operations.</p>
            </div>

            <div className="stats-grid">
              <StatCard title="Total Employees" value={employees.length} icon="👥" />
              <StatCard title="Active Employees" value={activeEmployees} icon="✅" />
              <StatCard title="Leave Requests" value={leaves.length} icon="📅" />
              <StatCard title="Approved Leaves" value={leaves.filter(l => l.status === "Approved").length} icon="✔️" />
            </div>

            <div className="content-card">
              <h2>Recent Activities</h2>
              {leaves.slice(-4).reverse().map(leave => (
                <div className="activity" key={leave.id}>
                  <strong>{leave.name}</strong>'s leave request is {leave.status}.
                </div>
              ))}
              {leaves.length === 0 && <p>No recent activities.</p>}
            </div>

            <div className="content-card">
              <h2>Team Overview</h2>
              <div className="team-grid">
                {["Development", "Design", "Finance", "Human Resources"].map(dept => (
                  <div className="team-card" key={dept}>
                    <h3>{dept}</h3>
                    <p>
                      {employees.filter(e => e.department === dept).length}
                      {" "}employees
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h2>Reports Overview</h2>
              <div className="team-grid">
                <div className="team-card">
                  <h3>Monthly Payroll</h3>
                  <p>₹{totalSalary.toLocaleString("en-IN")}</p>
                </div>
                <div className="team-card">
                  <h3>Present Employees</h3>
                  <p>{presentCount}</p>
                </div>
                <div className="team-card">
                  <h3>Pending Leaves</h3>
                  <p>{pendingLeaves}</p>
                </div>
                <div className="team-card">
                  <h3>Total Employees</h3>
                  <p>{employees.length}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EMPLOYEE MANAGEMENT */}

        {page === "Employee Management" && (
          <>
            <div className="page-header section-heading">
              <div>
                <h1>Employee Management</h1>
                <p>Manage and organize your employees.</p>
              </div>

              <button className="primary-btn" onClick={openAddEmployee}>
                + Add Employee
              </button>
            </div>

            <div className="content-card">
              <input
                className="search-input"
                placeholder="Search employees..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map(employee => (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>₹{Number(employee.salary).toLocaleString("en-IN")}</td>
                        <td>
                          <button className="small-btn" onClick={() => openProfile(employee)}>
                            Profile
                          </button>
                          <button className="small-btn edit-btn" onClick={() => openEditEmployee(employee)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => deleteEmployee(employee.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredEmployees.length === 0 && (
                  <p className="empty-message">No employees found.</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* LEAVE MANAGEMENT */}

        {page === "Leave Management" && (
          <>
            <div className="page-header section-heading">
              <div>
                <h1>Leave Management</h1>
                <p>Manage employee leave requests and track leave status.</p>
              </div>
              <button className="primary-btn" onClick={() => setShowLeaveForm(true)}>
                + Add Leave
              </button>
            </div>

            <div className="stats-grid">
              <StatCard title="Total Requests" value={leaves.length} icon="📋" />
              <StatCard title="Pending Requests" value={pendingLeaves} icon="⏳" />
              <StatCard title="Approved Requests" value={leaves.filter(l => l.status === "Approved").length} icon="✔️" />
              <StatCard title="Rejected Requests" value={leaves.filter(l => l.status === "Rejected").length} icon="❌" />
            </div>

            <div className="content-card">
              <h2>Leave Requests</h2>
              <input
                className="search-input"
                placeholder="Search employee..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map(leave => (
                      <tr key={leave.id}>
                        <td>{leave.name}</td>
                        <td>{leave.type}</td>
                        <td>{leave.from}</td>
                        <td>{leave.to}</td>
                        <td>{leave.reason}</td>
                        <td><Status value={leave.status} /></td>
                        <td>
                          {leave.status === "Pending" && (
                            <>
                              <button className="approve-btn" onClick={() => updateLeave(leave.id, "Approved")}>Approve</button>
                              <button className="delete-btn" onClick={() => updateLeave(leave.id, "Rejected")}>Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ATTENDANCE */}

        {page === "Attendance" && (
          <>
            <div className="page-header">
              <h1>Attendance Management</h1>
              <p>Manage and track employee attendance.</p>
            </div>

            <div className="stats-grid">
              <StatCard title="Present" value={presentCount} icon="✅" />
              <StatCard title="Absent" value={absentCount} icon="❌" />
              <StatCard title="Late" value={lateCount} icon="⏰" />
              <StatCard title="Total Employees" value={employees.length} icon="👥" />
            </div>

            <div className="content-card">
              <h2>Employee Attendance</h2>
              <input
                className="search-input"
                placeholder="Search employees..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Department</th>
                      <th>Attendance Status</th>
                      <th>Mark Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.department}</td>
                        <td><Status value={item.status} /></td>
                        <td>
                          <select
                            value={item.status}
                            onChange={e => updateAttendance(item.id, e.target.value)}
                          >
                            <option>Present</option>
                            <option>Absent</option>
                            <option>Late</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* SALARY AND PAYROLL */}

        {page === "Salary & Payroll" && (
          <>
            <div className="page-header">
              <h1>Salary & Payroll</h1>
              <p>View employee salary details and monthly payroll.</p>
            </div>

            <div className="stats-grid">
              <StatCard title="Total Employees" value={employees.length} icon="👥" />
              <StatCard title="Monthly Payroll" value={`₹${totalSalary.toLocaleString("en-IN")}`} icon="💰" />
              <StatCard title="Average Salary" value={`₹${employees.length ? Math.round(totalSalary / employees.length).toLocaleString("en-IN") : 0}`} icon="📈" />
              <StatCard title="Annual Payroll" value={`₹${(totalSalary * 12).toLocaleString("en-IN")}`} icon="📊" />
            </div>

            <div className="content-card">
              <h2>Employee Salary Details</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Monthly Salary</th>
                      <th>Annual Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(employee => (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>₹{Number(employee.salary).toLocaleString("en-IN")}</td>
                        <td>₹{(Number(employee.salary) * 12).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ADD / EDIT EMPLOYEE POPUP */}

      {showEmployeeForm && (
        <div className="modal-overlay" onClick={() => setShowEmployeeForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>
                <p>Enter employee information below.</p>
              </div>
              <button className="close-btn" onClick={() => setShowEmployeeForm(false)}>✕</button>
            </div>

            <form onSubmit={saveEmployee}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee Name</label>
                  <input
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={form.department}
                    onChange={e => setForm({...form, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    <option>Development</option>
                    <option>Design</option>
                    <option>Finance</option>
                    <option>Human Resources</option>
                    <option>Marketing</option>
                    <option>Administration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    placeholder="Enter job position"
                    value={form.position}
                    onChange={e => setForm({...form, position: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Monthly Salary (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter salary"
                    value={form.salary}
                    onChange={e => setForm({...form, salary: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEmployeeForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingEmployee ? "Update Employee" : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROFESSIONAL EMPLOYEE PROFILE POPUP */}

      {showProfile && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>

            <div className="profile-top">
              <button className="close-btn profile-close" onClick={() => setShowProfile(false)}>✕</button>

              <div className="profile-avatar">
                {selectedEmployee.name.charAt(0).toUpperCase()}
              </div>

              <h2>{selectedEmployee.name}</h2>
              <p>{selectedEmployee.position}</p>
              <span>{selectedEmployee.department}</span>
            </div>

            <div className="profile-details">
              <h3>Employee Information</h3>

              <div className="profile-detail-row">
                <span>👤 Employee Name</span>
                <strong>{selectedEmployee.name}</strong>
              </div>

              <div className="profile-detail-row">
                <span>✉️ Email Address</span>
                <strong>{selectedEmployee.email}</strong>
              </div>

              <div className="profile-detail-row">
                <span>🏢 Department</span>
                <strong>{selectedEmployee.department}</strong>
              </div>

              <div className="profile-detail-row">
                <span>💼 Position</span>
                <strong>{selectedEmployee.position}</strong>
              </div>

              <div className="profile-detail-row">
                <span>💰 Monthly Salary</span>
                <strong className="salary-text">
                  ₹{Number(selectedEmployee.salary).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="profile-footer">
              <button className="cancel-btn" onClick={() => setShowProfile(false)}>
                Close
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  setShowProfile(false);
                  openEditEmployee(selectedEmployee);
                }}
              >
                Edit Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD LEAVE POPUP */}

      {showLeaveForm && (
        <div className="modal-overlay" onClick={() => setShowLeaveForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Add Leave Request</h2>
                <p>Enter leave details.</p>
              </div>
              <button className="close-btn" onClick={() => setShowLeaveForm(false)}>✕</button>
            </div>

            <form onSubmit={saveLeave}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Employee Name</label>
                  <select
                    value={leaveForm.name}
                    onChange={e => setLeaveForm({...leaveForm, name: e.target.value})}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}
                  >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Annual Leave</option>
                    <option>Emergency Leave</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>From Date</label>
                  <input type="date" value={leaveForm.from}
                    onChange={e => setLeaveForm({...leaveForm, from: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>To Date</label>
                  <input type="date" min={leaveForm.from} value={leaveForm.to}
                    onChange={e => setLeaveForm({...leaveForm, to: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <input placeholder="Enter reason" value={leaveForm.reason}
                    onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} required />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowLeaveForm(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

import { useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  position: "",
  status: "Active",
};

function Employee({
  employees = [],
  addEmployee,
  updateEmployee,
  deleteEmployee,
}) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const departments = [
    "All",
    ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (emp.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" ||
      emp.department === departmentFilter;

    const matchesStatus =
      statusFilter === "All" || emp.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      updateEmployee(editingId, form);
    } else {
      addEmployee({
        ...form,
        id: Date.now(),
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      position: employee.position || "",
      status: employee.status || "Active",
    });

    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage and organize your employees.</p>
        </div>

        <button className="primary-btn" onClick={openAddForm}>
          + Add Employee
        </button>
      </div>

      <div className="employee-filters">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>
                    <span className={`status ${employee.status?.toLowerCase()}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(employee)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(employee.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <h2>
              {editingId !== null ? "Edit Employee" : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Employee Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
                required
              />

              <input
                name="position"
                placeholder="Job Position"
                value={form.position}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  {editingId !== null ? "Update Employee" : "Save Employee"}
                </button>

                <button type="button" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employee;

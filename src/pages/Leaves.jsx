
import { useState } from "react";

function Leaves({
  leaves = [],
  employees = [],
  addLeave,
  updateLeaveStatus,
}) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const emptyForm = {
    employee: "",
    type: "Casual Leave",
    from: "",
    to: "",
    reason: "",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredLeaves = leaves.filter((leave) =>
    (leave.employee || "").toLowerCase().includes(search.toLowerCase())
  );

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.to < form.from) {
      alert("To Date cannot be earlier than From Date.");
      return;
    }

    addLeave({
      ...form,
      id: Date.now(),
      status: "Pending",
    });

    setForm(emptyForm);
    setShowForm(false);
  };

  const closeForm = () => {
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Leave Management</h1>
          <p>Manage employee leave requests and track leave status.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Leave
        </button>
      </div>

      <div className="stats-grid leave-stats">
        <div className="stat-card blue">
          <div className="stat-icon">📋</div>
          <div>
            <h2>{leaves.length}</h2>
            <p>Total Requests</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div>
            <h2>{pending}</h2>
            <p>Pending Requests</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✔</div>
          <div>
            <h2>{approved}</h2>
            <p>Approved Requests</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">✕</div>
          <div>
            <h2>{rejected}</h2>
            <p>Rejected Requests</p>
          </div>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="panel-heading">
          <h2>Leave Requests</h2>

          <input
            className="leave-search"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
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
              {filteredLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td><strong>{leave.employee}</strong></td>
                  <td>{leave.type}</td>
                  <td>{leave.from}</td>
                  <td>{leave.to}</td>
                  <td>{leave.reason}</td>

                  <td>
                    <span className={`status ${leave.status?.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>

                  <td className="action-buttons">
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          className="approve-btn"
                          title="Approve"
                          onClick={() =>
                            updateLeaveStatus(leave.id, "Approved")
                          }
                        >
                          ✓
                        </button>

                        <button
                          className="delete-btn"
                          title="Reject"
                          onClick={() =>
                            updateLeaveStatus(leave.id, "Rejected")
                          }
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="completed-label">Completed</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="table-footer">
          Showing {filteredLeaves.length} of {leaves.length} requests
        </p>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Leave Request</h2>

            <form onSubmit={handleSubmit}>
              <label>Employee Name</label>

              <select
                required
                value={form.employee}
                onChange={(e) =>
                  setForm({ ...form, employee: e.target.value })
                }
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <label>Leave Type</label>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Annual Leave</option>
                <option>Earned Leave</option>
                <option>Unpaid Leave</option>
              </select>

              <label>From Date</label>

              <input
                required
                type="date"
                value={form.from}
                onChange={(e) =>
                  setForm({ ...form, from: e.target.value })
                }
              />

              <label>To Date</label>

              <input
                required
                type="date"
                min={form.from}
                value={form.to}
                onChange={(e) =>
                  setForm({ ...form, to: e.target.value })
                }
              />

              <label>Reason</label>

              <textarea
                required
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
                placeholder="Enter reason for leave"
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Leaves;

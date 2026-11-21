
function Dashboard({
  employees = [],
  leaves = [],
  activities = [],
}) {
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const defaultActivities = [
    {
      id: 1,
      message: "Priya Sharma's leave was rejected",
      time: "Just now",
    },
  ];

  const recentActivities = (
    activities.length > 0 ? activities : defaultActivities
  ).slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>HR Management Dashboard</h1>
          <p>
            Streamlining workforce management and employee operations.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <h2>{employees.length}</h2>
          <p>Employees in the organization</p>
        </div>

        <div className="stat-card">
          <h3>Active Employees</h3>
          <h2>{activeEmployees}</h2>
          <p>Currently active employees</p>
        </div>

        <div className="stat-card">
          <h3>Leave Requests</h3>
          <h2>{leaves.length}</h2>
          <p>Total leave applications</p>
        </div>

        <div className="stat-card">
          <h3>Approved Leaves</h3>
          <h2>{approvedLeaves}</h2>
          <p>Approved applications</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Activities</h2>

        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div className="activity-item" key={activity.id || index}>
              <div>
                <p>{activity.message}</p>
                <small>{activity.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Team Overview</h2>

        <div className="team-grid">
          <div className="team-card">
            <h3>Human Resources</h3>
            <p>Manage employee records and HR activities.</p>
          </div>

          <div className="team-card">
            <h3>Administration</h3>
            <p>Manage daily office operations.</p>
          </div>

          <div className="team-card">
            <h3>Technology</h3>
            <p>Manage technical team operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

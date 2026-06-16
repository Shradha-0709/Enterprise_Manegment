export default function Dashboard() {
  return (
    <section id="dashboardSection" className="content-section active">
      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="panel metric-card metric-blue">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">home_repair_service</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Assets</span>
            <span className="metric-value" id="metricAssets">0</span>
          </div>
        </div>
        <div className="panel metric-card metric-teal">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">pending_actions</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending Tickets</span>
            <span className="metric-value" id="metricPendingTickets">0</span>
          </div>
        </div>
        <div className="panel metric-card metric-pink">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">warning</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Low Stock Parts</span>
            <span className="metric-value" id="metricLowStock">0</span>
          </div>
        </div>
        <div className="panel metric-card metric-amber">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">payments</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Maintenance Cost</span>
            <span className="metric-value" id="metricTotalCost">₹0</span>
          </div>
        </div>
      </div>

      {/* Two Column Details */}
      <div className="dashboard-grid">
        {/* Urgent / In Progress Tickets */}
        <div className="panel">
          <div className="table-header">
            <h2 className="table-title">Active Maintenance Schedules</h2>
            <button className="btn btn-secondary">View All</button>
          </div>
          <div className="table-container">
            <table className="custom-table" id="dashboardTicketsTable">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Target Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Loading schedules...</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Panel */}
        <div className="panel">
          <div className="table-header">
            <h2 className="table-title">Parts to Reorder</h2>
          </div>
          <div className="table-container">
            <table className="custom-table" id="dashboardStockTable">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Checking inventory...</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

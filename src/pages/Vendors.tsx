export default function VendorsPage() {
  return (
    <section id="vendorsSection" className="content-section active">
      <div className="panel">
        <div className="table-header">
          <h2 className="table-title">Service Providers & AMC Contracts</h2>
        </div>
        <div className="table-container">
          <table className="custom-table" id="vendorsTable">
            <thead>
              <tr>
                <th>Provider Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>AMC Contract Term</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="vendorsTableBody">
              <tr>
                <td colSpan={6} className="empty-state">
                  <span className="material-symbols-rounded empty-state-icon">sync</span>
                  <div className="empty-state-title">Loading vendors...</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

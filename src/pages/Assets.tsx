export default function AssetsPage() {
  return (
    <section id="assetsSection" className="content-section active">
      <div className="panel">
        <div className="table-header">
          <h2 className="table-title">Registered Assets</h2>
          <div className="table-filters">
            <select id="assetCategoryFilter" className="filter-select">
              <option value="">All Categories</option>
              <option value="Equipment">Equipment</option>
              <option value="Office Asset">Office Asset</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Facilities">Facilities</option>
            </select>
            <select id="assetStatusFilter" className="filter-select">
              <option value="">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Broken">Broken</option>
              <option value="Retired">Retired</option>
            </select>
            <div className="search-box">
              <span className="material-symbols-rounded">search</span>
              <input type="text" id="assetSearchInput" placeholder="Search assets..." />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="custom-table" id="assetsTable">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Serial No.</th>
                <th>Location</th>
                <th>Status</th>
                <th>Team Owner</th>
                <th>Purchase Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="assetsTableBody">
              <tr>
                <td colSpan={8} className="empty-state">
                  <span className="material-symbols-rounded empty-state-icon">sync</span>
                  <div className="empty-state-title">Loading assets...</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

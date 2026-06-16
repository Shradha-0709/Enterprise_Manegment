export default function InventoryPage() {
  return (
    <section id="inventorySection" className="content-section active">
      <div className="panel">
        <div className="table-header">
          <h2 className="table-title">Spare Parts stock</h2>
        </div>
        <div className="table-container">
          <table className="custom-table" id="inventoryTable">
            <thead>
              <tr>
                <th>Part Name</th>
                <th>Stock Level</th>
                <th>Reorder Alert Level</th>
                <th>Unit Cost</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="inventoryTableBody">
              <tr>
                <td colSpan={7} className="empty-state">
                  <span className="material-symbols-rounded empty-state-icon">sync</span>
                  <div className="empty-state-title">Loading inventory...</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

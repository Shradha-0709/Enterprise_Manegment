import React, { useState } from 'react';

const MOCK_WARRANTIES = [
  { id: 'W-1001', asset: 'HVAC Chiller Unit A', vendor: 'CoolBreeze HVAC', coverage: 'Comprehensive', startDate: '2024-01-10', expiryDate: '2027-01-09', status: 'Active' },
  { id: 'W-1002', asset: 'Passenger Elevator 1', vendor: 'Elevate Solutions', coverage: 'Parts & Labor', startDate: '2023-08-15', expiryDate: '2026-08-14', status: 'Expiring Soon' },
  { id: 'W-1003', asset: 'Main Server Rack UPS', vendor: 'SecureTech', coverage: 'Replacement', startDate: '2021-03-01', expiryDate: '2024-02-28', status: 'Expired' },
  { id: 'W-1004', asset: 'Lobby AC Unit', vendor: 'CoolBreeze HVAC', coverage: 'Labor Only', startDate: '2025-05-20', expiryDate: '2028-05-19', status: 'Active' },
];

export default function VendorWarranties() {
  const [warranties] = useState(MOCK_WARRANTIES);

  const handleExport = () => {
    const headers = ['Warranty ID', 'Covered Asset', 'Provided By', 'Coverage Type', 'Expiry Date', 'Status'];
    const rows = warranties.map(w => [
      w.id,
      w.asset,
      w.vendor,
      w.coverage,
      w.expiryDate,
      w.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'asset_warranties.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="content-section active">
      <div className="panel">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="table-title" style={{ margin: 0 }}>Asset Warranties & Provider Mapping</h2>
          <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={handleExport}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>download</span> Export
          </button>
        </div>
        <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Warranty ID</th>
                <th>Covered Asset</th>
                <th>Provided By</th>
                <th>Coverage Type</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map(w => (
                <tr key={w.id}>
                  <td style={{ color: 'var(--text-secondary)' }}>{w.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w.asset}</td>
                  <td>{w.vendor}</td>
                  <td>{w.coverage}</td>
                  <td>{w.expiryDate}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: w.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : w.status === 'Expiring Soon' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: w.status === 'Active' ? 'var(--primary)' : w.status === 'Expiring Soon' ? 'var(--warning)' : 'var(--danger)'
                    }}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

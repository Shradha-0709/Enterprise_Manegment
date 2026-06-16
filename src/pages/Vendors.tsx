import React, { useState } from 'react';

const MOCK_VENDORS = [
  { id: 1, name: 'CoolBreeze HVAC', contact: 'John Smith', email: 'john@coolbreeze.com', phone: '(555) 123-4567', amc: 'Ends Dec 2026' },
  { id: 2, name: 'Elevate Solutions', contact: 'Jane Doe', email: 'jane@elevate.com', phone: '(555) 987-6543', amc: 'Ends Aug 2026' },
  { id: 3, name: 'SecureTech', contact: 'Mike Ross', email: 'mike@securetech.com', phone: '(555) 456-7890', amc: 'Ends Mar 2027' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState(MOCK_VENDORS);

  return (
    <section id="vendorsSection" className="content-section active">
      <div className="panel">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="table-title" style={{ margin: 0 }}>Service Providers & AMC Contracts</h2>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span> Add Vendor
          </button>
        </div>
        <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
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
              {vendors.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td>{v.contact}</td>
                  <td style={{ color: 'var(--secondary)' }}>{v.email}</td>
                  <td>{v.phone}</td>
                  <td>
                    <span style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {v.amc}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>edit</span>
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>delete</span>
                      </button>
                    </div>
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

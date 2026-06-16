import React, { useState } from 'react';

const MOCK_INVENTORY = [
  { id: 1, name: 'HVAC Filters (HEPA)', stock: 15, reorder: 5, cost: '₹45.00', location: 'Warehouse A', status: 'In Stock' },
  { id: 2, name: 'Elevator Relay Module', stock: 2, reorder: 3, cost: '₹320.00', location: 'Storage B', status: 'Low Stock' },
  { id: 3, name: 'LED Bulbs (60W equiv)', stock: 120, reorder: 50, cost: '₹3.50', location: 'Warehouse A', status: 'In Stock' },
  { id: 4, name: 'Fire Extinguisher ABC', stock: 0, reorder: 10, cost: '₹85.00', location: 'Main Building', status: 'Out of Stock' },
  { id: 5, name: 'Pipe Sealant Tape', stock: 45, reorder: 20, cost: '₹2.00', location: 'Tool Room', status: 'In Stock' },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'In Stock': return <span style={{ padding: '6px 12px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Low Stock': return <span style={{ padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Out of Stock': return <span style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      default: return null;
    }
  };

  return (
    <section id="inventorySection" className="content-section active">
      <div className="panel">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="table-title" style={{ margin: 0 }}>Spare Parts Stock</h2>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span> Add Part
          </button>
        </div>
        <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
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
              {inventory.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ fontWeight: 600, color: item.stock === 0 ? 'var(--danger)' : 'inherit' }}>{item.stock}</td>
                  <td>{item.reorder}</td>
                  <td>{item.cost}</td>
                  <td>{item.location}</td>
                  <td>{getStatusBadge(item.status)}</td>
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

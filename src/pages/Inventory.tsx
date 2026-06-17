import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchInventory = async () => {
    setLoading(true);
    const { data } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
    if (data) setInventory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
    const handleRefresh = () => fetchInventory();
    window.addEventListener('inventory-updated', handleRefresh);
    return () => window.removeEventListener('inventory-updated', handleRefresh);
  }, []);

  const openInventoryModal = () => {
    searchParams.set('modal', 'inventory');
    setSearchParams(searchParams);
  };

  const handleEdit = (id: string) => {
    searchParams.set('modal', 'inventory');
    searchParams.set('editId', id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (!error) {
        setInventory(inventory.filter(item => item.id !== id));
      } else {
        alert('Failed to delete part');
      }
    }
  };

  const getStatus = (quantity: number, reorder_level: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= reorder_level) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusBadge = (quantity: number, reorder_level: number) => {
    const status = getStatus(quantity, reorder_level);
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
          <h2 className="table-title" style={{ margin: 0 }}>Stock</h2>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={openInventoryModal}>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Loading stock...</div>
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem' }}>inventory_2</span>
                    <div className="empty-state-title">No parts found</div>
                  </td>
                </tr>
              ) : (
                inventory.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.part_name}</td>
                    <td style={{ fontWeight: 600, color: item.quantity === 0 ? 'var(--danger)' : 'inherit' }}>{item.quantity}</td>
                    <td>{item.reorder_level}</td>
                    <td>₹{Number(item.unit_cost).toFixed(2)}</td>
                    <td>{item.location}</td>
                    <td>{getStatusBadge(item.quantity, item.reorder_level)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => handleEdit(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

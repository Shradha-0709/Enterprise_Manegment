import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function MaintenancePreventive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*, assets(name)')
      .eq('type', 'Preventive')
      .order('scheduled_date', { ascending: true });
    
    if (data) setRecords(data);
    setLoading(false);
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      const { error } = await supabase.from('maintenance_records').delete().eq('id', id);
      if (!error) {
        setRecords(records.filter(r => r.id !== id));
        window.dispatchEvent(new Event('maintenance-updated'));
      } else {
        alert('Failed to delete record');
      }
    }
  };

  useEffect(() => {
    fetchRecords();
    
    // Listen for modal close events to refresh list
    const handleRefresh = () => fetchRecords();
    window.addEventListener('maintenance-updated', handleRefresh);
    return () => window.removeEventListener('maintenance-updated', handleRefresh);
  }, []);

  const openModal = () => {
    searchParams.set('modal', 'maintenance');
    searchParams.set('maintType', 'Preventive');
    setSearchParams(searchParams);
  };

  const handleEdit = (id: string) => {
    searchParams.set('modal', 'maintenance');
    searchParams.set('maintType', 'Preventive');
    searchParams.set('editId', id);
    setSearchParams(searchParams);
  };

  return (
    <section className="content-section active">
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="table-header">
          <h2 className="table-title">Preventive Maintenance Schedules</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={fetchRecords}>
              <span className="material-symbols-rounded">refresh</span> Sync
            </button>
            <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={openModal}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span> Add Schedule
            </button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Schedule ID</th>
                <th>Equipment / Asset</th>
                <th>Frequency</th>
                <th>Team</th>
                <th>Next Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Loading schedules...</div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem' }}>check_circle</span>
                    <div className="empty-state-title">No preventive maintenance schedules!</div>
                  </td>
                </tr>
              ) : (
                records.map((pm) => {
                  let frequency = 'N/A';
                  let description = pm.description || '';
                  if (description.startsWith('[')) {
                    const match = description.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) {
                      frequency = match[1];
                      description = match[2];
                    }
                  }
                  
                  return (
                  <tr key={pm.id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{pm.id.slice(0, 8)}</td>
                    <td>{pm.assets?.name || 'Unknown Asset'}</td>
                    <td>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        {frequency}
                      </span>
                    </td>
                    <td>{pm.assigned_team || 'Unassigned'}</td>
                    <td>{new Date(pm.scheduled_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${pm.status?.toLowerCase().replace(' ', '-')}`}>
                        {pm.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(pm.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit Schedule">
                          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>edit</span>
                        </button>
                        <button onClick={() => handleDelete(pm.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete Schedule">
                          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

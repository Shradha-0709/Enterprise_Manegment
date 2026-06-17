import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function MaintenanceCorrective() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*, assets(name)')
      .eq('type', 'Corrective')
      .order('scheduled_date', { ascending: true });
    
    if (data) setRecords(data);
    setLoading(false);
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
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
    searchParams.set('maintType', 'Corrective');
    setSearchParams(searchParams);
  };

  const handleEdit = (id: string) => {
    searchParams.set('modal', 'maintenance');
    searchParams.set('maintType', 'Corrective');
    searchParams.set('editId', id);
    setSearchParams(searchParams);
  };

  return (
    <section className="content-section active">
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="table-header">
          <h2 className="table-title">Corrective Maintenance Requests</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={fetchRecords}>
              <span className="material-symbols-rounded">refresh</span> Sync
            </button>
            <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={openModal}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span> New Request
            </button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Issue Description</th>
                <th>Equipment / Asset</th>
                <th>Date Reported</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Loading requests...</div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem' }}>check_circle</span>
                    <div className="empty-state-title">No corrective maintenance requests!</div>
                  </td>
                </tr>
              ) : (
                records.map((cr) => (
                  <tr key={cr.id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{cr.id.slice(0, 8)}</td>
                    <td>{cr.description}</td>
                    <td>{cr.assets?.name || 'Unknown Asset'}</td>
                    <td>{new Date(cr.scheduled_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${cr.status?.toLowerCase().replace(' ', '-')}`}>
                        {cr.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(cr.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit Request">
                          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>edit</span>
                        </button>
                        <button onClick={() => handleDelete(cr.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete Request">
                          <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>delete</span>
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

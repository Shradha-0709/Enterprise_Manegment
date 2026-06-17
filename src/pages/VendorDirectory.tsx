import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function VendorDirectory() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: false });
    if (data) setVendors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
    const handleRefresh = () => fetchVendors();
    window.addEventListener('vendor-updated', handleRefresh);
    return () => window.removeEventListener('vendor-updated', handleRefresh);
  }, []);

  const openVendorModal = () => {
    searchParams.set('modal', 'vendor');
    setSearchParams(searchParams);
  };

  const handleEdit = (id: string) => {
    searchParams.set('modal', 'vendor');
    searchParams.set('editId', id);
    setSearchParams(searchParams);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      const { error } = await supabase.from('vendors').delete().eq('id', id);
      if (!error) {
        setVendors(vendors.filter(v => v.id !== id));
      } else {
        alert('Failed to delete vendor');
      }
    }
  };

  return (
    <section className="content-section active">
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="table-title" style={{ margin: 0 }}>Service Providers & AMC Contracts</h2>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={openVendorModal}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add</span> Add Vendor
          </button>
        </div>
        <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <table className="custom-table">
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
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Loading vendors...</div>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem' }}>check_circle</span>
                    <div className="empty-state-title">No vendors found</div>
                  </td>
                </tr>
              ) : (
                vendors.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td>{v.contact_name}</td>
                    <td style={{ color: 'var(--secondary)' }}>{v.email}</td>
                    <td>{v.phone}</td>
                    <td>
                      <span style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {v.amc_end_date ? `Ends ${new Date(v.amc_end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'No AMC'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => handleEdit(v.id)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>edit</span>
                        </button>
                        <button onClick={() => handleDelete(v.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
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

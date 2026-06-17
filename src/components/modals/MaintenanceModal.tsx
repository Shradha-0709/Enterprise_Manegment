'use client';

import { useSearchParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MaintenanceModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const maintType = searchParams.get('maintType') || 'Preventive';
  const editId = searchParams.get('editId');
  const [record, setRecord] = useState<any>(null);

  let defaultFreq = "Monthly";
  let defaultDesc = record?.description || "";
  if (record && record.type === 'Preventive' && defaultDesc.startsWith('[')) {
    const match = defaultDesc.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      defaultFreq = match[1];
      defaultDesc = match[2];
    }
  }

  const modalTitle = editId ? 'Edit Maintenance Record' : (maintType === 'Corrective' ? 'New Corrective Request' : 'Schedule Maintenance');

  useEffect(() => {
    if (editId) {
      const fetchRecord = async () => {
        const { data } = await supabase.from('maintenance_records').select('*').eq('id', editId).single();
        if (data) setRecord(data);
      };
      fetchRecord();
    }
  }, [editId]);

  useEffect(() => {
    const fetchAssets = async () => {
      const { data } = await supabase.from('assets').select('id, name');
      if (data) setAssets(data);
    };
    fetchAssets();
  }, []);

  const closeModal = () => {
    searchParams.delete('modal');
    searchParams.delete('maintType');
    searchParams.delete('editId');
    setSearchParams(searchParams);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const freq = formData.get('maintFrequency');
    let desc = formData.get('maintDesc') as string;
    
    if (maintType === 'Preventive' && freq) {
      desc = `[${freq}] ${desc}`;
    }

    const newRecord = {
      asset_id: formData.get('maintAsset'),
      type: formData.get('maintType'),
      assigned_team: formData.get('maintTeam'),
      description: desc,
      scheduled_date: formData.get('maintScheduledDate'),
      status: formData.get('maintStatus'),
    };
    
    // Default zero values for new records
    if (!editId) {
      Object.assign(newRecord, {
        completed_date: null,
        cost: 0,
        downtime_hours: 0,
      });
    }

    let error;
    if (editId) {
      const { error: updateError } = await supabase.from('maintenance_records').update(newRecord).eq('id', editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('maintenance_records').insert([newRecord]);
      error = insertError;
    }
    
    setLoading(false);
    
    if (!error) {
      closeModal();
      // Optionally trigger a refresh event or rely on page reload
      window.dispatchEvent(new Event('maintenance-updated'));
    } else {
      console.error('Error saving record:', error);
      alert(`Failed to save record: ${error.message} - ${error.details || ''}`);
    }
  };

  return (
    <div className="modal-overlay" id="maintenanceModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="maintenanceModalTitle">{modalTitle}</h3>
          <button className="modal-close" onClick={closeModal} disabled={loading}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="maintenanceForm" onSubmit={handleSubmit} key={record?.id || 'new'}>
          <input type="hidden" id="maintenanceId" name="maintenanceId" value={record?.id || ''} />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="maintAsset">Select Asset</label>
              <select className="form-input" id="maintAsset" name="maintAsset" required defaultValue={record?.asset_id || ""}>
                <option value="">-- Select Asset --</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="maintType">Maintenance Type</label>
                <input className="form-input" id="maintType" name="maintType" value={record?.type || maintType} readOnly style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="maintTeam">Assigned Team</label>
                <select className="form-input" id="maintTeam" name="maintTeam" required defaultValue={record?.assigned_team || "Maintenance Team"}>
                  <option value="Maintenance Team">Maintenance Team</option>
                  <option value="Facility Team">Facility Team</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="maintDesc">Description of Issues / Task</label>
              <textarea className="form-input" id="maintDesc" name="maintDesc" required defaultValue={defaultDesc}></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="maintScheduledDate">{maintType === 'Preventive' ? 'First Scheduled Date' : 'Target / Scheduled Date'}</label>
                <input className="form-input" type="date" id="maintScheduledDate" name="maintScheduledDate" required defaultValue={record?.scheduled_date ? new Date(record.scheduled_date).toISOString().split('T')[0] : ""} />
              </div>
              {maintType === 'Preventive' ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="maintFrequency">Frequency</label>
                  <select className="form-input" id="maintFrequency" name="maintFrequency" required defaultValue={defaultFreq}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Bi-Annual">Bi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" htmlFor="maintStatus">Status</label>
                  <select className="form-input" id="maintStatus" name="maintStatus" defaultValue={record?.status || "Scheduled"}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
            
            {maintType === 'Preventive' && (
              <div className="form-group">
                <label className="form-label" htmlFor="maintStatus">Status</label>
                <select className="form-input" id="maintStatus" name="maintStatus" defaultValue={record?.status || "Scheduled"}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

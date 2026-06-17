'use client';

import { useSearchParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function VendorModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const editId = searchParams.get('editId');

  useEffect(() => {
    if (editId) {
      const fetchRecord = async () => {
        const { data } = await supabase.from('vendors').select('*').eq('id', editId).single();
        if (data) setRecord(data);
      };
      fetchRecord();
    }
  }, [editId]);

  const closeModal = () => {
    searchParams.delete('modal');
    searchParams.delete('editId');
    setSearchParams(searchParams);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const newRecord = {
      name: formData.get('vendorName'),
      contact_name: formData.get('vendorContact'),
      email: formData.get('vendorEmail'),
      phone: formData.get('vendorPhone'),
      amc_start_date: formData.get('vendorAmcStart') || null,
      amc_end_date: formData.get('vendorAmcEnd') || null,
    };

    let error;
    if (editId) {
      const { error: updateError } = await supabase.from('vendors').update(newRecord).eq('id', editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('vendors').insert([newRecord]);
      error = insertError;
    }
    
    setLoading(false);
    if (!error) {
      closeModal();
      window.dispatchEvent(new Event('vendor-updated'));
    } else {
      console.error('Error saving vendor:', error);
      alert(`Failed to save vendor: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay" id="vendorModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="vendorModalTitle">{editId ? 'Edit Vendor' : 'Add Vendor Contract'}</h3>
          <button className="modal-close" onClick={closeModal} disabled={loading}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="vendorForm" onSubmit={handleSubmit} key={record?.id || 'new'}>
          <input type="hidden" id="vendorId" name="vendorId" value={record?.id || ''} />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="vendorName">Company / Provider Name</label>
              <input className="form-input" type="text" id="vendorName" name="vendorName" required defaultValue={record?.name || ''} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="vendorContact">Contact Person</label>
              <input className="form-input" type="text" id="vendorContact" name="vendorContact" required defaultValue={record?.contact_name || ''} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorEmail">Email Address</label>
                <input className="form-input" type="email" id="vendorEmail" name="vendorEmail" required defaultValue={record?.email || ''} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorPhone">Phone Number</label>
                <input className="form-input" type="text" id="vendorPhone" name="vendorPhone" required defaultValue={record?.phone || ''} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorAmcStart">AMC Start Date</label>
                <input className="form-input" type="date" id="vendorAmcStart" name="vendorAmcStart" defaultValue={record?.amc_start_date ? new Date(record.amc_start_date).toISOString().split('T')[0] : ''} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorAmcEnd">AMC End Date</label>
                <input className="form-input" type="date" id="vendorAmcEnd" name="vendorAmcEnd" defaultValue={record?.amc_end_date ? new Date(record.amc_end_date).toISOString().split('T')[0] : ''} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Vendor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

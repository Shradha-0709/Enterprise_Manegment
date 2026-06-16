'use client';

import { useSearchParams } from 'react-router-dom';
import { FormEvent } from 'react';

export default function VendorModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  const closeModal = () => {
    searchParams.delete('modal');
    setSearchParams(searchParams);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Supabase integration
    closeModal();
  };

  return (
    <div className="modal-overlay" id="vendorModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="vendorModalTitle">Add Vendor Contract</h3>
          <button className="modal-close" onClick={closeModal}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="vendorForm" onSubmit={handleSubmit}>
          <input type="hidden" id="vendorId" />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="vendorName">Company / Provider Name</label>
              <input className="form-input" type="text" id="vendorName" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="vendorContact">Contact Person</label>
              <input className="form-input" type="text" id="vendorContact" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorEmail">Email Address</label>
                <input className="form-input" type="email" id="vendorEmail" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorPhone">Phone Number</label>
                <input className="form-input" type="text" id="vendorPhone" required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorAmcStart">AMC Start Date</label>
                <input className="form-input" type="date" id="vendorAmcStart" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="vendorAmcEnd">AMC End Date</label>
                <input className="form-input" type="date" id="vendorAmcEnd" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Vendor</button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function MaintenanceModal() {
  const router = useRouter();

  const closeModal = () => {
    router.push('?', { scroll: false });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Supabase integration
    closeModal();
  };

  return (
    <div className="modal-overlay" id="maintenanceModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="maintenanceModalTitle">Schedule Maintenance</h3>
          <button className="modal-close" onClick={closeModal}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="maintenanceForm" onSubmit={handleSubmit}>
          <input type="hidden" id="maintenanceId" />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="maintAsset">Select Asset</label>
              <select className="form-input" id="maintAsset" required>
                <option value="">-- Select Asset --</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="maintType">Maintenance Type</label>
                <select className="form-input" id="maintType" required>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="maintTeam">Assigned Team</label>
                <select className="form-input" id="maintTeam" required>
                  <option value="Maintenance Team">Maintenance Team</option>
                  <option value="Facility Team">Facility Team</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="maintDesc">Description of Issues / Task</label>
              <textarea className="form-input" id="maintDesc" required></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="maintScheduledDate">Scheduled Date</label>
                <input className="form-input" type="date" id="maintScheduledDate" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="maintCompletedDate">Completed Date</label>
                <input className="form-input" type="date" id="maintCompletedDate" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="maintCost">Invoice Cost (₹)</label>
                <input className="form-input" type="number" id="maintCost" min="0" defaultValue="0" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="maintDowntime">Asset Downtime (hours)</label>
                <input className="form-input" type="number" id="maintDowntime" min="0" defaultValue="0" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="maintStatus">Status</label>
              <select className="form-input" id="maintStatus">
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Work Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}

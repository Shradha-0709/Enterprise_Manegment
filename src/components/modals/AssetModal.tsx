'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function AssetModal() {
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
    <div className="modal-overlay" id="assetModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="assetModalTitle">Register New Asset</h3>
          <button className="modal-close" onClick={closeModal}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="assetForm" onSubmit={handleSubmit}>
          <input type="hidden" id="assetId" />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="assetName">Asset Name</label>
              <input className="form-input" type="text" id="assetName" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="assetCategory">Category</label>
                <select className="form-input" id="assetCategory" required>
                  <option value="Equipment">Equipment</option>
                  <option value="Office Asset">Office Asset</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Facilities">Facilities</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="assetSerial">Serial Number</label>
                <input className="form-input" type="text" id="assetSerial" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="assetStatus">Operational Status</label>
                <select className="form-input" id="assetStatus">
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Broken">Broken</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="assetOwner">Ownership Team</label>
                <select className="form-input" id="assetOwner" required>
                  <option value="Operations Team">Operations Team</option>
                  <option value="Facility Team">Facility Team</option>
                  <option value="Maintenance Team">Maintenance Team</option>
                  <option value="Finance Team">Finance Team</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="assetLocation">Location / Installation Area</label>
              <input className="form-input" type="text" id="assetLocation" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="assetCost">Purchase Cost (₹)</label>
                <input className="form-input" type="number" id="assetCost" min="0" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="assetPurchaseDate">Purchase Date</label>
                <input className="form-input" type="date" id="assetPurchaseDate" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="assetWarranty">Warranty Expiration Date</label>
              <input className="form-input" type="date" id="assetWarranty" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

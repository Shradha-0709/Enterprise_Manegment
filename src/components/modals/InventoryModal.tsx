'use client';

import { useSearchParams } from 'react-router-dom';
import { FormEvent } from 'react';

export default function InventoryModal() {
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
    <div className="modal-overlay" id="inventoryModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="inventoryModalTitle">Add Spare Part</h3>
          <button className="modal-close" onClick={closeModal}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="inventoryForm" onSubmit={handleSubmit}>
          <input type="hidden" id="inventoryId" />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="partName">Part Name / Item Code</label>
              <input className="form-input" type="text" id="partName" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="partQty">Initial Stock Qty</label>
                <input className="form-input" type="number" id="partQty" min="0" defaultValue="0" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="partReorder">Reorder Threshold Qty</label>
                <input className="form-input" type="number" id="partReorder" min="0" defaultValue="5" required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="partCost">Unit Purchase Cost (₹)</label>
                <input className="form-input" type="number" id="partCost" min="0" step="0.01" defaultValue="0.00" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="partLocation">Warehouse Location</label>
                <input className="form-input" type="text" id="partLocation" placeholder="e.g. Aisle B-2" required />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Part</button>
          </div>
        </form>
      </div>
    </div>
  );
}

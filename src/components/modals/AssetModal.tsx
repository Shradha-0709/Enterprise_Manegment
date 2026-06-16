import { useSearchParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AssetModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    searchParams.delete('modal');
    setSearchParams(searchParams);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const newAsset = {
      name: formData.get('assetName'),
      category: formData.get('assetCategory'),
      serial_number: formData.get('assetSerial'),
      status: formData.get('assetStatus'),
      owner_team: formData.get('assetOwner'),
      location: formData.get('assetLocation'),
      purchase_cost: parseFloat(formData.get('assetCost') as string),
      purchase_date: formData.get('assetPurchaseDate'),
      warranty_expiration: formData.get('assetWarranty') || null,
    };

    const { error } = await supabase.from('assets').insert([newAsset]);

    setIsSubmitting(false);

    if (error) {
      alert('Error saving asset: ' + error.message);
    } else {
      alert('Asset registered successfully!');
      closeModal();
      window.location.reload(); // Quick refresh to show data
    }
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
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="assetName">Asset Name</label>
              <input className="form-input" type="text" name="assetName" id="assetName" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="assetCategory">Category</label>
                <select className="form-input" name="assetCategory" id="assetCategory" required>
                  <option value="Equipment">Equipment</option>
                  <option value="Office Asset">Office Asset</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Facilities">Facilities</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="assetSerial">Serial Number</label>
                <input className="form-input" type="text" name="assetSerial" id="assetSerial" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="assetStatus">Operational Status</label>
                <select className="form-input" name="assetStatus" id="assetStatus">
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Broken">Broken</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="assetOwner">Ownership Team</label>
                <select className="form-input" name="assetOwner" id="assetOwner" required>
                  <option value="Operations Team">Operations Team</option>
                  <option value="Facility Team">Facility Team</option>
                  <option value="Maintenance Team">Maintenance Team</option>
                  <option value="Finance Team">Finance Team</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="assetLocation">Location / Installation Area</label>
              <input className="form-input" type="text" name="assetLocation" id="assetLocation" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="assetCost">Purchase Cost (₹)</label>
                <input className="form-input" type="number" name="assetCost" id="assetCost" min="0" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="assetPurchaseDate">Purchase Date</label>
                <input className="form-input" type="date" name="assetPurchaseDate" id="assetPurchaseDate" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="assetWarranty">Warranty Expiration Date</label>
              <input className="form-input" type="date" name="assetWarranty" id="assetWarranty" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

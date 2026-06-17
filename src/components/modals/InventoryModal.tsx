'use client';

import { useSearchParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function InventoryModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const editId = searchParams.get('editId');

  useEffect(() => {
    if (editId) {
      const fetchRecord = async () => {
        const { data } = await supabase.from('inventory').select('*').eq('id', editId).single();
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
      part_name: formData.get('partName'),
      quantity: Number(formData.get('partQty')),
      reorder_level: Number(formData.get('partReorder')),
      unit_cost: Number(formData.get('partCost')),
      location: formData.get('partLocation'),
    };

    let error;
    if (editId) {
      const { error: updateError } = await supabase.from('inventory').update(newRecord).eq('id', editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('inventory').insert([newRecord]);
      error = insertError;
    }
    
    setLoading(false);
    if (!error) {
      closeModal();
      window.dispatchEvent(new Event('inventory-updated'));
    } else {
      console.error('Error saving part:', error);
      alert(`Failed to save part: ${error.message}`);
    }
  };

  return (
    <div className="modal-overlay" id="inventoryModal" style={{ display: 'flex' }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title" id="inventoryModalTitle">{editId ? 'Edit Spare Part' : 'Add Spare Part'}</h3>
          <button className="modal-close" onClick={closeModal} disabled={loading}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        <form id="inventoryForm" onSubmit={handleSubmit} key={record?.id || 'new'}>
          <input type="hidden" id="inventoryId" name="inventoryId" value={record?.id || ''} />
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="partName">Part Name / Item Code</label>
              <input className="form-input" type="text" id="partName" name="partName" required defaultValue={record?.part_name || ''} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="partQty">Initial Stock Qty</label>
                <input className="form-input" type="number" id="partQty" name="partQty" min="0" defaultValue={record?.quantity ?? 0} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="partReorder">Reorder Threshold Qty</label>
                <input className="form-input" type="number" id="partReorder" name="partReorder" min="0" defaultValue={record?.reorder_level ?? 5} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="partCost">Unit Purchase Cost (₹)</label>
                <input className="form-input" type="number" id="partCost" name="partCost" min="0" step="0.01" defaultValue={record?.unit_cost ?? 0.00} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="partLocation">Warehouse Location</label>
                <input className="form-input" type="text" id="partLocation" name="partLocation" placeholder="e.g. Aisle B-2" required defaultValue={record?.location || ''} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Part'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

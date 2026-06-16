import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assets:', error);
      } else {
        setAssets(data || []);
      }
    } catch (err) {
      console.error('Failed to load assets', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = selectedCategory 
    ? assets.filter(asset => asset.category === selectedCategory)
    : assets;

  return (
    <section id="assetsSection" className="content-section active">
      <div className="panel">
        <div className="table-header">
          <h2 className="table-title">Registered Assets</h2>
          <div className="table-filters" style={{ display: 'flex', gap: '10px' }}>
            <select 
              id="assetCategoryFilter" 
              className="form-input" 
              style={{ width: 'auto' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Equipment">Equipment</option>
              <option value="Office Asset">Office Asset</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Facilities">Facilities</option>
            </select>
            <button className="btn btn-secondary" onClick={fetchAssets}>
              <span className="material-symbols-rounded">refresh</span> Sync
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="custom-table" id="assetsTable">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Serial No.</th>
                <th>Location</th>
                <th>Status</th>
                <th>Team Owner</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody id="assetsTableBody">
              {loading ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon">sync</span>
                    <div className="empty-state-title">Syncing from Supabase...</div>
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '3rem' }}>inventory</span>
                    <div className="empty-state-title" style={{ marginTop: '10px' }}>
                      {assets.length === 0 ? "No assets found. Click 'Register Asset' to add one." : `No assets found in category "${selectedCategory}".`}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.serial_number || 'N/A'}</td>
                    <td>{asset.location}</td>
                    <td>
                      <span className={`status-badge ${asset.status?.toLowerCase().replace(' ', '-')}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td>{asset.owner_team}</td>
                    <td>{new Date(asset.purchase_date).toLocaleDateString()}</td>
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

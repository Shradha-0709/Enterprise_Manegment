import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'react-router-dom';

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeCategoryView, setActiveCategoryView] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('iAssetOne_IT_Categories_v2');
    return saved ? JSON.parse(saved) : ['Laptops & PCs', 'Networking Equipment', 'Servers', 'Peripherals'];
  });

  const saveCategories = (newCats: string[]) => {
    setCategories(newCats);
    localStorage.setItem('iAssetOne_IT_Categories_v2', JSON.stringify(newCats));
  };

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

  const getPlaceholderImage = (category: string) => {
    switch(category) {
      case 'Laptops & PCs': return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80';
      case 'Networking Equipment': return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';
      case 'Servers': return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
      case 'Peripherals': return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
      case 'Office': return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
      default: return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (!error) fetchAssets();
      else alert("Error deleting asset.");
    }
  };

  const getAssetsByCategory = (category: string) => {
    const matching = assets.filter(a => a.category === category);
    if (!selectedCategory) return matching;
    if (selectedCategory === category) return matching;
    return []; // hide if another category is selected
  };

  return (
    <section id="assetsSection" className="content-section active">
      <style>{`
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }
        .category-card {
          background: linear-gradient(145deg, var(--panel-bg) 0%, rgba(1, 21, 15, 0.8) 100%);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.4);
          border-color: rgba(16, 185, 129, 0.4);
        }
        .category-header {
          height: 220px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
        }
        .category-header::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(1, 21, 15, 0.95) 100%);
          z-index: 1;
        }
        .category-header-content {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }
        .category-count {
          font-size: 0.9rem;
          color: var(--primary);
          background: rgba(16, 185, 129, 0.15);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.3);
          font-weight: 600;
        }
      `}</style>

      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h2 className="table-title" style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>Assets Directory</h2>
        <div className="table-filters" style={{ display: 'flex', gap: '12px' }}>
          {!activeCategoryView && (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                const newCat = window.prompt('Enter new category name:');
                if (newCat && !categories.includes(newCat)) saveCategories([...categories, newCat]);
              }}
            >
              <span className="material-symbols-rounded">add</span> Add Category
            </button>
          )}
          <button className="btn btn-secondary" onClick={fetchAssets} disabled={loading}>
            <span className="material-symbols-rounded" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>sync</span> 
            Sync
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <span className="material-symbols-rounded empty-state-icon">sync</span>
          <div className="empty-state-title">Loading assets...</div>
        </div>
      ) : assets.length === 0 ? (
        <div className="empty-state panel">
          <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '3rem', color: 'var(--primary)' }}>inventory_2</span>
          <div className="empty-state-title" style={{ marginTop: '10px' }}>
            No assets found in your directory.
          </div>
        </div>
      ) : activeCategoryView ? (
        <div className="panel" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="table-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '15px', color: '#fff' }}>
              <button className="btn btn-secondary" onClick={() => setActiveCategoryView(null)} style={{ padding: '6px 12px' }}>
                <span className="material-symbols-rounded">arrow_back</span>
                Back
              </button>
              {activeCategoryView} Assets
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="category-count" style={{ 
                fontSize: '0.9rem', color: 'var(--primary)', background: 'rgba(16, 185, 129, 0.15)', 
                padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 
              }}>
                {getAssetsByCategory(activeCategoryView).length} Total
              </span>
              <button 
                className="btn btn-primary" 
                style={{ padding: '6px 12px' }}
                onClick={() => {
                  searchParams.set('modal', 'asset');
                  setSearchParams(searchParams);
                }}
              >
                <span className="material-symbols-rounded">add</span> Register Asset
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Serial No.</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Team Owner</th>
                  <th>Purchase Date</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {getAssetsByCategory(activeCategoryView).length === 0 ? (
                   <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No assets found.</td></tr>
                ) : (
                  getAssetsByCategory(activeCategoryView).map(asset => (
                    <tr key={asset.id}>
                      <td>{asset.name}</td>
                      <td>{asset.serial_number || 'N/A'}</td>
                      <td>{asset.location}</td>
                      <td><span className={`status-badge ${asset.status?.toLowerCase().replace(' ', '-')}`}>{asset.status}</span></td>
                      <td>{asset.owner_team}</td>
                      <td>{new Date(asset.purchase_date).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-icon" 
                          style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }} 
                          onClick={() => handleDeleteAsset(asset.id)}
                          title="Delete Asset"
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => {
            const catAssets = getAssetsByCategory(category);
            if (selectedCategory && selectedCategory !== category) return null;

            return (
              <div 
                key={category} 
                className="category-card panel" 
                style={{ padding: 0 }}
                onClick={() => setActiveCategoryView(category)}
              >
                <div 
                  className="category-header"
                  style={{ backgroundImage: `url(${getPlaceholderImage(category)})` }}
                >
                  <button 
                    className="btn btn-icon"
                    style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, color: '#ef4444', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete the "${category}" category?`)) {
                        saveCategories(categories.filter(c => c !== category));
                      }
                    }}
                    title="Remove Category"
                  >
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                  <div className="category-header-content">
                    <h2 className="category-title">{category}</h2>
                    <span className="category-count">{catAssets.length} Assets</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

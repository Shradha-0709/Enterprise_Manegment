import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const MOCK_INVENTORY = [
  { id: 1, name: 'HVAC Filters (HEPA)', stock: 15, reorder: 5, cost: '₹45.00', location: 'Warehouse A', status: 'In Stock' },
  { id: 2, name: 'Elevator Relay Module', stock: 2, reorder: 3, cost: '₹320.00', location: 'Storage B', status: 'Low Stock' },
  { id: 3, name: 'LED Bulbs (60W equiv)', stock: 120, reorder: 50, cost: '₹3.50', location: 'Warehouse A', status: 'In Stock' },
  { id: 4, name: 'Fire Extinguisher ABC', stock: 0, reorder: 10, cost: '₹85.00', location: 'Main Building', status: 'Out of Stock' },
  { id: 5, name: 'Pipe Sealant Tape', stock: 45, reorder: 20, cost: '₹2.00', location: 'Tool Room', status: 'In Stock' },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    pendingTickets: 0,
    maintenanceCost: 0,
  });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch total assets
      const { count: assetsCount } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true });

      // Fetch maintenance records
      // We'll join assets to get the asset name for the table
      const { data: maintData } = await supabase
        .from('maintenance_records')
        .select('*, assets(name)')
        .order('scheduled_date', { ascending: true });

      if (maintData) {
        const pending = maintData.filter(m => m.status !== 'Completed').length;
        const totalCost = maintData.reduce((sum, m) => sum + (m.cost || 0), 0);
        
        setMetrics({
          totalAssets: assetsCount || 0,
          pendingTickets: pending,
          maintenanceCost: totalCost,
        });

        // Get only active schedules (not completed) for the table
        setSchedules(maintData.filter(m => m.status !== 'Completed').slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dashboardSection" className="content-section active">
      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="panel metric-card metric-blue">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">home_repair_service</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Assets</span>
            <span className="metric-value">{loading ? '...' : metrics.totalAssets}</span>
          </div>
        </div>
        <div className="panel metric-card metric-teal">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">pending_actions</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending Tickets</span>
            <span className="metric-value">{loading ? '...' : metrics.pendingTickets}</span>
          </div>
        </div>
        <div className="panel metric-card metric-pink">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">warning</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Low Stock Parts</span>
            <span className="metric-value">{MOCK_INVENTORY.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').length}</span>
          </div>
        </div>
        <div className="panel metric-card metric-amber">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">payments</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Maintenance Cost</span>
            <span className="metric-value">₹{loading ? '...' : metrics.maintenanceCost}</span>
          </div>
        </div>
      </div>

      {/* Two Column Details */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Urgent / In Progress Tickets */}
        <div className="panel">
          <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h2 className="table-title">Active Maintenance Schedules</h2>
            <button className="btn btn-secondary" onClick={fetchDashboardData}>
              <span className="material-symbols-rounded">refresh</span> Sync
            </button>
          </div>
          <div className="table-container">
            <table className="custom-table" id="dashboardTicketsTable">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Target Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <span className="material-symbols-rounded empty-state-icon">sync</span>
                      <div className="empty-state-title">Loading schedules...</div>
                    </td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem' }}>check_circle</span>
                      <div className="empty-state-title">No active maintenance tasks!</div>
                    </td>
                  </tr>
                ) : (
                  schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{schedule.assets?.name || 'Unknown Asset'}</td>
                      <td>{schedule.type}</td>
                      <td>{new Date(schedule.scheduled_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${schedule.status?.toLowerCase().replace(' ', '-')}`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Panel */}
        <div className="panel">
          <div className="table-header">
            <h2 className="table-title">Parts to Reorder</h2>
          </div>
          <div className="table-container">
            <table className="custom-table" id="dashboardStockTable">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INVENTORY.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        background: item.status === 'Out of Stock' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: item.status === 'Out of Stock' ? 'var(--danger)' : 'var(--warning)',
                        borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                        border: `1px solid ${item.status === 'Out of Stock' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {item.stock} {item.status === 'Out of Stock' ? '(Empty)' : '(Low)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

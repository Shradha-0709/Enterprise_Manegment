import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    pendingTickets: 0,
    maintenanceCost: 0,
    lowStockCount: 0,
  });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [lowStockList, setLowStockList] = useState<any[]>([]);
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
      const { data: maintData } = await supabase
        .from('maintenance_records')
        .select('*, assets(name)')
        .order('scheduled_date', { ascending: true });

      // Fetch inventory to compute low stock
      const { data: invData } = await supabase
        .from('inventory')
        .select('*');

      let pending = 0;
      let totalCost = 0;
      let activeSchedules: any[] = [];
      
      if (maintData) {
        pending = maintData.filter(m => m.status !== 'Completed' && m.status !== 'Cancelled').length;
        totalCost = maintData.reduce((sum, m) => sum + (m.cost || 0), 0);
        activeSchedules = maintData.filter(m => m.status !== 'Completed' && m.status !== 'Cancelled').slice(0, 5);
      }

      let lowStockItems: any[] = [];
      if (invData) {
        lowStockItems = invData.filter(i => i.quantity <= i.reorder_level);
      }

      setMetrics({
        totalAssets: assetsCount || 0,
        pendingTickets: pending,
        maintenanceCost: totalCost,
        lowStockCount: lowStockItems.length,
      });

      setSchedules(activeSchedules);
      setLowStockList(lowStockItems.slice(0, 5)); // show top 5 low stock
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dashboardSection" className="content-section active">
      <style>{`
        .welcome-banner {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(2, 44, 34, 0.4) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 24px 30px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        .welcome-banner::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.2), transparent 40%);
          pointer-events: none;
        }
        .welcome-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.5px;
        }
        .welcome-subtitle {
          color: var(--text-secondary);
          margin-top: 6px;
          font-size: 1rem;
        }
        
        .metric-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-color);
          background: linear-gradient(145deg, rgba(2, 44, 34, 0.6) 0%, rgba(1, 21, 15, 0.9) 100%);
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          padding: 24px;
        }
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: transparent;
          transition: background 0.3s ease;
        }
        .metric-blue:hover::before { background: #3b82f6; }
        .metric-teal:hover::before { background: #14b8a6; }
        .metric-pink:hover::before { background: #ec4899; }
        .metric-amber:hover::before { background: #f59e0b; }

        .metric-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 25px -5px rgba(0,0,0,0.4);
        }
        
        .metric-blue .metric-icon-box { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
        .metric-teal .metric-icon-box { background: rgba(20, 184, 166, 0.15); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.3); }
        .metric-pink .metric-icon-box { background: rgba(236, 72, 153, 0.15); color: #ec4899; border: 1px solid rgba(236, 72, 153, 0.3); }
        .metric-amber .metric-icon-box { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }

        .dashboard-grid .panel {
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          background: linear-gradient(145deg, rgba(2, 44, 34, 0.5) 0%, rgba(1, 21, 15, 0.8) 100%);
        }
      `}</style>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Command Center</h1>
          <p className="welcome-subtitle">Here's your operational overview for today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={fetchDashboardData} disabled={loading}>
            <span className="material-symbols-rounded" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>sync</span>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid" style={{ marginBottom: '30px' }}>
        <div className="panel metric-card metric-blue">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">domain</span>
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
            <span className="metric-label">Active Tickets</span>
            <span className="metric-value">{loading ? '...' : metrics.pendingTickets}</span>
          </div>
        </div>
        <div className="panel metric-card metric-pink">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">warning</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Low Stock Alerts</span>
            <span className="metric-value">{loading ? '...' : metrics.lowStockCount}</span>
          </div>
        </div>
        <div className="panel metric-card metric-amber">
          <div className="metric-icon-box">
            <span className="material-symbols-rounded">payments</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Maintenance Cost</span>
            <span className="metric-value">₹{loading ? '...' : metrics.maintenanceCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Two Column Details */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Urgent / In Progress Tickets */}
        <div className="panel">
          <div className="table-header" style={{ marginBottom: '20px' }}>
            <h2 className="table-title">Active Maintenance Schedules</h2>
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
                      <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem', color: 'var(--success)' }}>check_circle</span>
                      <div className="empty-state-title">No active maintenance tasks!</div>
                    </td>
                  </tr>
                ) : (
                  schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td style={{ fontWeight: 500 }}>{schedule.assets?.name || 'Unknown Asset'}</td>
                      <td>
                        <span style={{ color: schedule.type === 'Corrective' ? 'var(--danger)' : 'var(--primary)', fontSize: '0.9rem' }}>
                          {schedule.type}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{new Date(schedule.scheduled_date).toLocaleDateString()}</td>
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
          <div className="table-header" style={{ marginBottom: '20px' }}>
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
                {loading ? (
                   <tr>
                    <td colSpan={2} className="empty-state">
                      <span className="material-symbols-rounded empty-state-icon">sync</span>
                      <div className="empty-state-title">Loading...</div>
                    </td>
                  </tr>
                ) : lowStockList.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="empty-state" style={{ padding: '30px 10px' }}>
                      <span className="material-symbols-rounded empty-state-icon" style={{ fontSize: '2.5rem', color: 'var(--success)' }}>inventory_2</span>
                      <div className="empty-state-title">Inventory is healthy!</div>
                    </td>
                  </tr>
                ) : (
                  lowStockList.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 500 }}>{item.part_name}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: item.quantity === 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: item.quantity === 0 ? 'var(--danger)' : 'var(--warning)',
                          borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                          border: `1px solid ${item.quantity === 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                        }}>
                          {item.quantity} {item.quantity === 0 ? '(Empty)' : '(Low)'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';

export default function ReportsPage() {
  const [downtime, setDowntime] = useState(142);
  
  return (
    <section id="reportsSection" className="content-section active">
      <div className="reports-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Utilization Panel */}
        <div className="panel chart-panel">
          <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--secondary)' }}>
              assessment
            </span>
            Asset Status Distribution
          </div>
          <div className="progress-metric-list" id="assetStatusBreakdown" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>Operational</span><span style={{ color: 'var(--success)' }}>75%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>In Maintenance</span><span style={{ color: 'var(--warning)' }}>15%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: 'var(--warning)' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>Out of Service</span><span style={{ color: 'var(--danger)' }}>10%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-color)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: 'var(--danger)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Costs Panel */}
        <div className="panel chart-panel">
          <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>
              pie_chart
            </span>
            Maintenance Cost Breakdown
          </div>
          <div className="cost-distribution-grid" id="costBreakdownGrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Preventive</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>₹12,450</div>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Corrective</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--warning)' }}>₹8,230</div>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Emergency</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--danger)' }}>₹5,100</div>
            </div>
            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Upgrades</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--secondary)' }}>₹4,000</div>
            </div>
          </div>
        </div>

        {/* Downtime Hours Reports */}
        <div className="panel chart-panel">
          <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--danger)' }}>
              hourglass_disabled
            </span>
            Accumulative Downtime
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '180px', gap: '15px' }}>
            <div
              style={{ fontSize: '4.5rem', fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--danger)', textShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}
              id="totalDowntimeVal"
            >
              {downtime} <span style={{ fontSize: '2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>hrs</span>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '250px', lineHeight: '1.5' }}>
              Total asset operational downtime caused by maintenance interventions this month.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

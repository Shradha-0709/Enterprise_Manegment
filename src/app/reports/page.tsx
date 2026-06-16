export default function ReportsPage() {
  return (
    <section id="reportsSection" className="content-section active">
      <div className="reports-layout">
        {/* Utilization Panel */}
        <div className="panel chart-panel">
          <div className="chart-title">
            <span className="material-symbols-rounded" style={{ color: 'var(--secondary)' }}>
              assessment
            </span>
            Asset Status Distribution
          </div>
          <div className="progress-metric-list" id="assetStatusBreakdown">
            {/* Populated dynamically */}
          </div>
        </div>

        {/* Maintenance Costs Panel */}
        <div className="panel chart-panel">
          <div className="chart-title">
            <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>
              pie_chart
            </span>
            Maintenance Cost Breakdown
          </div>
          <div className="cost-distribution-grid" id="costBreakdownGrid">
            {/* Populated dynamically */}
          </div>
        </div>

        {/* Downtime Hours Reports */}
        <div className="panel chart-panel">
          <div className="chart-title">
            <span className="material-symbols-rounded" style={{ color: 'var(--danger)' }}>
              hourglass_disabled
            </span>
            Accumulative Downtime Metrics
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '180px', gap: '10px' }}>
            <div
              style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--danger)' }}
              id="totalDowntimeVal"
            >
              0 hrs
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '200px' }}>
              Total asset operational downtime caused by maintenance interventions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

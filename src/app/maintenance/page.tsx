export default function MaintenancePage() {
  return (
    <section id="maintenanceSection" className="content-section active">
      {/* Kanban Board */}
      <div className="kanban-board">
        {/* Column Scheduled */}
        <div className="kanban-column" id="col-Scheduled" data-status="Scheduled">
          <div className="kanban-column-title">
            <span className="column-name">
              <span className="material-symbols-rounded" style={{ color: 'var(--warning)' }}>
                calendar_today
              </span>
              Scheduled
            </span>
            <span className="column-count" id="count-Scheduled">0</span>
          </div>
          <div className="kanban-cards" id="cards-Scheduled">
            {/* Dynamic Cards */}
          </div>
        </div>

        {/* Column In Progress */}
        <div className="kanban-column" id="col-Progress" data-status="In Progress">
          <div className="kanban-column-title">
            <span className="column-name">
              <span className="material-symbols-rounded" style={{ color: 'var(--secondary)' }}>
                pending
              </span>
              In Progress
            </span>
            <span className="column-count" id="count-Progress">0</span>
          </div>
          <div className="kanban-cards" id="cards-Progress">
            {/* Dynamic Cards */}
          </div>
        </div>

        {/* Column In Review */}
        <div className="kanban-column" id="col-Review" data-status="In Review">
          <div className="kanban-column-title">
            <span className="column-name">
              <span className="material-symbols-rounded" style={{ color: 'var(--primary)' }}>
                rate_review
              </span>
              In Review
            </span>
            <span className="column-count" id="count-Review">0</span>
          </div>
          <div className="kanban-cards" id="cards-Review">
            {/* Dynamic Cards */}
          </div>
        </div>

        {/* Column Completed */}
        <div className="kanban-column" id="col-Completed" data-status="Completed">
          <div className="kanban-column-title">
            <span className="column-name">
              <span className="material-symbols-rounded" style={{ color: 'var(--success)' }}>
                check_circle
              </span>
              Completed
            </span>
            <span className="column-count" id="count-Completed">0</span>
          </div>
          <div className="kanban-cards" id="cards-Completed">
            {/* Dynamic Cards */}
          </div>
        </div>
      </div>
    </section>
  );
}

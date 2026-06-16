import React, { useState } from 'react';

type Priority = 'low' | 'medium' | 'high';
type Status = 'Scheduled' | 'In Progress' | 'In Review' | 'Completed';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: 'WO-2041',
    title: 'HVAC Filter Replacement in Building A',
    priority: 'medium',
    status: 'Scheduled',
    assignee: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    dueDate: 'Today',
  },
  {
    id: 'WO-2042',
    title: 'Elevator Maintenance (Annual)',
    priority: 'high',
    status: 'Scheduled',
    assignee: { name: 'Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    dueDate: 'Tomorrow',
  },
  {
    id: 'WO-2039',
    title: 'Fix Leaking Pipe in Restroom 2',
    priority: 'high',
    status: 'In Progress',
    assignee: { name: 'Mike Davis', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    dueDate: 'Today',
  },
  {
    id: 'WO-2035',
    title: 'Update Firmware on Security Cameras',
    priority: 'low',
    status: 'In Review',
    assignee: { name: 'IT Support', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
    dueDate: 'Yesterday',
  },
  {
    id: 'WO-2028',
    title: 'Replace Fire Extinguishers on Floor 3',
    priority: 'medium',
    status: 'Completed',
    assignee: { name: 'Safety Team', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
    dueDate: 'Last Week',
  },
];

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const getTasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

  const renderCard = (task: Task) => (
    <div key={task.id} className="kanban-card" draggable>
      <div className="card-header">
        <span className="card-id">{task.id}</span>
        <span className={`card-priority priority-${task.priority}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      <div className="card-title">{task.title}</div>
      <div className="card-footer">
        <div className="card-assignee">
          <img src={task.assignee.avatar} alt={task.assignee.name} />
          <span>{task.assignee.name}</span>
        </div>
        <div className="card-date">{task.dueDate}</div>
      </div>
    </div>
  );

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
            <span className="column-count">{getTasksByStatus('Scheduled').length}</span>
          </div>
          <div className="kanban-cards">
            {getTasksByStatus('Scheduled').map(renderCard)}
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
            <span className="column-count">{getTasksByStatus('In Progress').length}</span>
          </div>
          <div className="kanban-cards">
            {getTasksByStatus('In Progress').map(renderCard)}
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
            <span className="column-count">{getTasksByStatus('In Review').length}</span>
          </div>
          <div className="kanban-cards">
            {getTasksByStatus('In Review').map(renderCard)}
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
            <span className="column-count">{getTasksByStatus('Completed').length}</span>
          </div>
          <div className="kanban-cards">
            {getTasksByStatus('Completed').map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Priority = 'low' | 'medium' | 'high';
type Status = 'Scheduled' | 'In Progress' | 'In Review' | 'Completed' | 'Cancelled';

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

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('maintenance_records').select('*');
      
      if (data) {
        const formatted: Task[] = data.map(record => {
          // Parse frequency out of description if present
          let cleanDesc = record.description || 'Unknown Task';
          if (cleanDesc.startsWith('[')) {
            const match = cleanDesc.match(/^\[(.*?)\]\s*(.*)$/);
            if (match) cleanDesc = match[2];
          }

          return {
            id: record.id,
            title: cleanDesc,
            priority: record.type === 'Corrective' ? 'high' : 'medium',
            status: record.status as Status || 'Scheduled',
            assignee: {
              name: record.assigned_team || 'Unassigned',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(record.assigned_team || 'Unassigned')}&background=random&color=fff`
            },
            dueDate: new Date(record.scheduled_date).toLocaleDateString()
          };
        });
        setTasks(formatted);
      }
    };
    fetchTasks();
    
    // Listen for updates to keep in sync
    const handleRefresh = () => fetchTasks();
    window.addEventListener('maintenance-updated', handleRefresh);
    return () => window.removeEventListener('maintenance-updated', handleRefresh);
  }, []);

  const getTasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

  const renderCard = (task: Task) => (
    <div key={task.id} className="kanban-card" draggable>
      <div className="card-header">
        <span className="card-id" title={task.id}>{task.id.slice(0, 8)}</span>
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

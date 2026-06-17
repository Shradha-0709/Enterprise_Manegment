import { useLocation, useSearchParams } from 'react-router-dom';

const routeMeta: Record<string, { title: string; subtitle: string; btnText: string; modalId: string; hideActions?: boolean }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Overview of enterprise assets, work tickets, and stock warnings.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/assets': {
    title: 'Assets Directory',
    subtitle: 'Manage company assets, categories, and warranty records.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/maintenance': {
    title: 'Maintenance',
    subtitle: 'Schedule and track repair work orders and AMC visits.',
    btnText: 'Schedule Work',
    modalId: 'maintenance'
  },
  '/maintenance/preventive': {
    title: 'Preventive Schedules',
    subtitle: 'Plan and manage recurring maintenance tasks.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/maintenance/corrective': {
    title: 'Corrective Requests',
    subtitle: 'Review and assign incoming repair requests.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/maintenance/tracking': {
    title: 'Service Tracking',
    subtitle: 'Schedule and track live repair work orders.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/vendors/directory': {
    title: 'Vendor Directory',
    subtitle: 'Directory of external service providers and contracts.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/vendors/warranties': {
    title: 'Asset Warranties',
    subtitle: 'Track asset warranties and provider coverage.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/inventory': {
    title: 'Inventory',
    subtitle: 'Track stock levels, unit costs, and reorder alerts.',
    btnText: '',
    modalId: '',
    hideActions: true
  },
  '/reports': {
    title: 'Reports & Analytics',
    subtitle: 'Operational metrics, costs, and downtime summaries.',
    btnText: 'Export Report',
    modalId: ''
  },
};

export default function Header() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const meta = routeMeta[location.pathname] || routeMeta['/'];

  return (
    <header className="top-header">
      <div className="header-title-container">
        <h1 id="pageTitle">{meta.title}</h1>
        <p id="pageSubtitle">{meta.subtitle}</p>
      </div>
      {!meta.hideActions && (
        <div className="header-actions">
          <button className="btn btn-secondary" id="refreshBtn">
            <span className="material-symbols-rounded">refresh</span>
            Sync
          </button>
          {meta.modalId && (
            <button 
              className="btn btn-primary" 
              id="globalActionBtn"
              onClick={() => {
                searchParams.set('modal', meta.modalId);
                setSearchParams(searchParams);
              }}
            >
              <span className="material-symbols-rounded">add</span>
              {meta.btnText}
            </button>
          )}
        </div>
      )}
    </header>
  );
}

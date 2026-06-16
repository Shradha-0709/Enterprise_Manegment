'use client';

import { usePathname, useRouter } from 'next/navigation';

const routeMeta: Record<string, { title: string; subtitle: string; btnText: string; modalId: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Overview of enterprise assets, work tickets, and stock warnings.',
    btnText: 'Register Asset',
    modalId: 'asset'
  },
  '/assets': {
    title: 'Assets Directory',
    subtitle: 'Manage company assets, categories, and warranty records.',
    btnText: 'Register Asset',
    modalId: 'asset'
  },
  '/maintenance': {
    title: 'Maintenance',
    subtitle: 'Schedule and track repair work orders and AMC visits.',
    btnText: 'Schedule Work',
    modalId: 'maintenance'
  },
  '/vendors': {
    title: 'Vendors & AMC',
    subtitle: 'Directory of external service providers and contracts.',
    btnText: 'Add Vendor',
    modalId: 'vendor'
  },
  '/inventory': {
    title: 'Spare Parts Inventory',
    subtitle: 'Track stock levels, unit costs, and reorder alerts.',
    btnText: 'Add Part',
    modalId: 'inventory'
  },
  '/reports': {
    title: 'Reports & Analytics',
    subtitle: 'Operational metrics, costs, and downtime summaries.',
    btnText: 'Export Report',
    modalId: ''
  },
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const meta = routeMeta[pathname] || routeMeta['/'];

  return (
    <header className="top-header">
      <button className="sidebar-toggle" id="sidebarToggle" aria-label="Toggle Sidebar">
        <span className="material-symbols-rounded">menu</span>
      </button>
      <div className="header-title-container">
        <h1 id="pageTitle">{meta.title}</h1>
        <p id="pageSubtitle">{meta.subtitle}</p>
      </div>
      <div className="header-actions">
        <button className="btn btn-secondary" id="refreshBtn">
          <span className="material-symbols-rounded">refresh</span>
          Sync
        </button>
        {meta.modalId && (
          <button 
            className="btn btn-primary" 
            id="globalActionBtn"
            onClick={() => router.push(`?modal=${meta.modalId}`, { scroll: false })}
          >
            <span className="material-symbols-rounded">add</span>
            {meta.btnText}
          </button>
        )}
      </div>
    </header>
  );
}

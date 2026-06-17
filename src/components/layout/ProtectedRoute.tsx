import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: '#fff' }}>
        <span className="material-symbols-rounded" style={{ animation: 'spin 1s linear infinite', fontSize: '2rem' }}>sync</span>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  const routeAccess: Record<string, string[]> = {
    '/': ['Administrator', 'Operations Team', 'Facility Team', 'Maintenance Team', 'Finance Team'],
    '/assets': ['Administrator', 'Operations Team', 'Facility Team'],
    '/maintenance': ['Administrator', 'Facility Team', 'Maintenance Team'],
    '/vendors': ['Administrator', 'Facility Team', 'Finance Team'],
    '/inventory': ['Administrator', 'Operations Team', 'Maintenance Team'],
    '/reports': ['Administrator', 'Finance Team'],
    '/roles': ['Administrator']
  };

  let isAllowed = true;
  const path = location.pathname;
  
  // Find matching route mapping
  for (const [route, roles] of Object.entries(routeAccess)) {
    if (path === route || (route !== '/' && path.startsWith(route))) {
      if (!roles.includes(user.role)) {
        isAllowed = false;
      }
      break; // Match found, stop checking
    }
  }

  if (!isAllowed) {
    // Redirect unauthorized attempts to dashboard
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the layout with Sidebar, Header, and the matched child route
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

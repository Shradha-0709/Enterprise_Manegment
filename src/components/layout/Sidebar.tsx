import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Assets Directory', path: '/assets', icon: 'category' },
    { name: 'Maintenance', path: '/maintenance', icon: 'build' },
    { name: 'Vendors & AMC', path: '/vendors', icon: 'handshake' },
    { name: 'Spare Parts', path: '/inventory', icon: 'inventory_2' },
    { name: 'Reports', path: '/reports', icon: 'monitoring' },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="logo-container">
        <div className="logo-text">
          <span className="material-symbols-rounded logo-icon">precision_manufacturing</span>
          iAssetOne
        </div>
      </div>

      <ul className="nav-links">
        {navLinks.map((link) => (
          <li
            key={link.path}
            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
          >
            <Link to={link.path}>
              <span className="material-symbols-rounded">{link.icon}</span>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <p>iAssetOne v0.1</p>
        <p>&copy; 2026 Team Ideassion</p>
      </div>
    </aside>
  );
}

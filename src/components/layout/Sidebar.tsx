'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

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
            className={`nav-item ${pathname === link.path ? 'active' : ''}`}
          >
            <Link href={link.path}>
              <span className="material-symbols-rounded">{link.icon}</span>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <p>AssetFlow Suite v1.1</p>
        <p>&copy; 2026 Team 1 Enterprise</p>
      </div>
    </aside>
  );
}

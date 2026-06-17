import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Maintenance': location.pathname.startsWith('/maintenance'),
    'Vendors & AMC': location.pathname.startsWith('/vendors')
  });

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: 'dashboard', allowedRoles: ['Administrator', 'Operations Team', 'Facility Team', 'Maintenance Team', 'Finance Team'] },
    { name: 'Assets Directory', path: '/assets', icon: 'category', allowedRoles: ['Administrator', 'Operations Team', 'Facility Team'] },
    { 
      name: 'Maintenance', 
      path: '/maintenance', 
      icon: 'build',
      allowedRoles: ['Administrator', 'Facility Team', 'Maintenance Team'],
      subLinks: [
        { name: 'Preventive Schedules', path: '/maintenance/preventive' },
        { name: 'Corrective Requests', path: '/maintenance/corrective' },
        { name: 'Service Tracking', path: '/maintenance/tracking' },
      ]
    },
    { 
      name: 'Vendors & AMC', 
      path: '/vendors', 
      icon: 'handshake',
      allowedRoles: ['Administrator', 'Facility Team', 'Finance Team'],
      subLinks: [
        { name: 'Vendor Directory', path: '/vendors/directory' },
        { name: 'Warranties & Assets', path: '/vendors/warranties' },
      ]
    },
    { name: 'Inventory', path: '/inventory', icon: 'inventory_2', allowedRoles: ['Administrator', 'Operations Team', 'Maintenance Team'] },
    { name: 'Reports', path: '/reports', icon: 'monitoring', allowedRoles: ['Administrator', 'Finance Team'] },
    { name: 'Role Management', path: '/roles', icon: 'manage_accounts', allowedRoles: ['Administrator'] },
  ];

  const filteredLinks = navLinks.filter(link => user && link.allowedRoles.includes(user.role));

  return (
    <aside className="sidebar" id="sidebar">
      <div className="logo-container">
        <div className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-rounded logo-icon" style={{ fontSize: '1.8rem' }}>precision_manufacturing</span>
          iAssetOne
        </div>
      </div>

      <ul className="nav-links">
        {filteredLinks.map((link) => (
          <li
            key={link.name}
            className={`nav-item ${location.pathname === link.path || (link.subLinks && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
          >
            {link.subLinks ? (
              <>
                <div 
                  onClick={() => toggleMenu(link.name)}
                  style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', gap: '12px', color: 'var(--text-secondary)' }}
                >
                  <span className="material-symbols-rounded">{link.icon}</span>
                  <span style={{ flex: 1 }}>{link.name}</span>
                  <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: openMenus[link.name] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </div>
                {openMenus[link.name] && (
                  <ul style={{ listStyle: 'none', padding: '0 0 10px 0', margin: '0', background: 'rgba(0,0,0,0.2)' }}>
                    {link.subLinks.map(sub => (
                      <li key={sub.path} className={`nav-item ${location.pathname === sub.path ? 'active' : ''}`}>
                        <Link to={sub.path} style={{ padding: '8px 20px 8px 52px', fontSize: '0.9rem' }}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link to={link.path} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: '12px' }}>
                <span className="material-symbols-rounded">{link.icon}</span>
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <p style={{ margin: '0', fontWeight: '600', color: '#fff', fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</p>
                <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--primary)' }}>{user.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginTop: '10px', width: '100%', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <p>iAssetOne v0.1</p>
            <p>&copy; 2026 Team Ideassion</p>
          </>
        )}
      </div>
    </aside>
  );
}

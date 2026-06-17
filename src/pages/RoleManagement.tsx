import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function RoleManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, email, role')
      .order('name');
    
    if (data) {
      setUsers(data);
    } else if (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: UserProfile) => {
    setEditingId(user.id);
    setEditRole(user.role);
  };

  const handleSaveRole = async (userId: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: editRole })
      .eq('id', userId);
      
    if (!error) {
      setEditingId(null);
      fetchUsers();
    } else {
      alert("Error updating role: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const rolesList = ['Administrator', 'Operations Team', 'Facility Team', 'Maintenance Team', 'Finance Team'];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif' }}>Role Management</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Manage access control by assigning user roles.</p>
      </div>

      <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>Role</th>
                <th style={{ textAlign: 'right', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                    <span className="material-symbols-rounded" style={{ animation: 'spin 1s linear infinite', fontSize: '2rem' }}>sync</span>
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                        {u.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name} {currentUser?.id === u.id && '(You)'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {editingId === u.id ? (
                      <select 
                        className="form-input" 
                        value={editRole} 
                        onChange={(e) => setEditRole(e.target.value)}
                        style={{ padding: '6px 12px', minWidth: '150px' }}
                      >
                        {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        backgroundColor: u.role === 'Administrator' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: u.role === 'Administrator' ? '#10b981' : 'var(--text-secondary)'
                      }}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {editingId === u.id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={handleCancelEdit}>Cancel</button>
                        <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => handleSaveRole(u.id)}>Save</button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px' }} 
                        onClick={() => handleEditClick(u)}
                        disabled={currentUser?.id === u.id}
                        title={currentUser?.id === u.id ? "You cannot edit your own role" : "Edit Role"}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>edit</span> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

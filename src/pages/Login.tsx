import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Note: In production, always use Supabase Auth (supabase.auth.signInWithPassword)
      // We are querying the custom table here per the demo setup requested
      const { data, error: dbError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('Invalid credentials. Have you run the SQL setup script yet?');
      } else {
        login({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role
        });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="panel" style={{ width: '100%', maxWidth: '400px', margin: '0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="material-symbols-rounded logo-icon" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>precision_manufacturing</span>
          </div>
          <h1 style={{ margin: '0', fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif' }}>iAssetOne</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. facility@iasset.com"
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}

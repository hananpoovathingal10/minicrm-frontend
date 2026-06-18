import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Settings, Shield, User, Globe, Save, Lock, Users } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'profile'>('general');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  // General settings state
  const [appName, setAppName] = useState(() => localStorage.getItem('crm_app_name') || 'MiniCRM');
  const [currency, setCurrency] = useState(() => localStorage.getItem('crm_currency') || 'USD');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('crm_timezone') || 'GMT+5:30');

  // Security settings state
  const [reqNumbers, setReqNumbers] = useState(() => localStorage.getItem('crm_sec_req_numbers') === 'true');
  const [reqSymbols, setReqSymbols] = useState(() => localStorage.getItem('crm_sec_req_symbols') === 'true');
  const [reqUppercase, setReqUppercase] = useState(() => localStorage.getItem('crm_sec_req_uppercase') === 'true');
  const [mfaEnabled, setMfaEnabled] = useState(() => localStorage.getItem('crm_sec_mfa') === 'true');
  const [sessionTimeout, setSessionTimeout] = useState(() => Number(localStorage.getItem('crm_sec_timeout')) || 30);
  const [rolesPermissions, setRolesPermissions] = useState(() => {
    const saved = localStorage.getItem('crm_sec_roles');
    return saved ? JSON.parse(saved) : [
      { role: 'Administrator', read: true, write: true, delete: true },
      { role: 'Sales Manager', read: true, write: true, delete: false },
      { role: 'Sales Agent', read: true, write: false, delete: false },
      { role: 'Support Specialist', read: true, write: true, delete: false },
    ];
  });

  // Admin profile state
  const [adminName, setAdminName] = useState(() => localStorage.getItem('crm_admin_name') || 'System Administrator');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('crm_admin_email') || 'admin@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Attempt to sync profile email from backend on mount
    const fetchProfile = async () => {
      try {
        const data = await fetchWithAuth('/auth/profile');
        if (data && data.email) {
          if (!localStorage.getItem('crm_admin_email')) {
            localStorage.setItem('crm_admin_email', data.email);
            setAdminEmail(data.email);
          }
        }
      } catch (err) {
        console.error('Failed to load backend profile in settings', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    localStorage.setItem('crm_app_name', appName);
    localStorage.setItem('crm_currency', currency);
    localStorage.setItem('crm_timezone', timezone);
    
    // Trigger event for MainLayout/Sidebar
    window.dispatchEvent(new Event('crm-settings-changed'));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    localStorage.setItem('crm_sec_req_numbers', String(reqNumbers));
    localStorage.setItem('crm_sec_req_symbols', String(reqSymbols));
    localStorage.setItem('crm_sec_req_uppercase', String(reqUppercase));
    localStorage.setItem('crm_sec_mfa', String(mfaEnabled));
    localStorage.setItem('crm_sec_timeout', String(sessionTimeout));
    localStorage.setItem('crm_sec_roles', JSON.stringify(rolesPermissions));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTogglePermission = (roleIndex: number, field: 'read' | 'write' | 'delete') => {
    // Admin permissions are locked to all-true for system safety
    if (rolesPermissions[roleIndex].role === 'Administrator') return;

    const updated = [...rolesPermissions];
    updated[roleIndex] = {
      ...updated[roleIndex],
      [field]: !updated[roleIndex][field]
    };
    setRolesPermissions(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setError('Current password is required to change password.');
        return;
      }
      // Simple mock validation (default pwd is admin123 or previously saved password)
      const savedPassword = localStorage.getItem('crm_admin_password') || 'admin123';
      if (currentPassword !== savedPassword) {
        setError('Current password is incorrect.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      localStorage.setItem('crm_admin_password', newPassword);
    }

    localStorage.setItem('crm_admin_name', adminName);
    localStorage.setItem('crm_admin_email', adminEmail);
    
    // Trigger event for MainLayout/Sidebar
    window.dispatchEvent(new Event('crm-settings-changed'));

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>System Settings</h1>
        <p>Manage application preferences, profile parameters, and security policies</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Settings Navigation */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', height: 'fit-content' }}>
          <button 
            className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} 
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            onClick={() => { setActiveTab('general'); setIsSaved(false); setError(''); }}
          >
            <Settings size={16} /> General Preferences
          </button>
          <button 
            className={`nav-link ${activeTab === 'security' ? 'active' : ''}`} 
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            onClick={() => { setActiveTab('security'); setIsSaved(false); setError(''); }}
          >
            <Shield size={16} /> Security & Roles
          </button>
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} 
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
            onClick={() => { setActiveTab('profile'); setIsSaved(false); setError(''); }}
          >
            <User size={16} /> Admin Profile
          </button>
        </div>

        {/* Tab Contents */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          
          {/* GENERAL PREFERENCES TAB */}
          {activeTab === 'general' && (
            <div>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <Globe size={20} style={{ color: 'var(--primary)' }} /> General Settings
              </h2>
              <p style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>Customize CRM app configurations, display language, timezone, and formats.</p>

              <form onSubmit={handleSaveGeneral}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>CRM Application Name</label>
                  <input required type="text" value={appName} onChange={e => setAppName(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Preferred Currency</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ background: '#000' }}>
                      <option value="USD">USD ($) United States Dollar</option>
                      <option value="EUR">EUR (€) Euro</option>
                      <option value="GBP">GBP (£) British Pound</option>
                      <option value="INR">INR (₹) Indian Rupee</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Default Timezone</label>
                    <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ background: '#000' }}>
                      <option value="GMT-5:00">GMT-5:00 Eastern Time</option>
                      <option value="GMT+0:00">GMT+0:00 UTC Time</option>
                      <option value="GMT+1:00">GMT+1:00 Central European Time</option>
                      <option value="GMT+5:30">GMT+5:30 Indian Standard Time</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Save size={16} /> Save Preferences
                  </button>
                  {isSaved && <span style={{ color: 'var(--success)', fontWeight: '500', fontSize: '0.95rem' }}>✓ Settings saved successfully!</span>}
                </div>
              </form>
            </div>
          )}

          {/* SECURITY & ROLES TAB */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <Shield size={20} style={{ color: 'var(--secondary)' }} /> Security Policies & Roles
              </h2>
              <p style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>Enforce password authentication rules, session timeouts, and role-based permissions.</p>

              <form onSubmit={handleSaveSecurity}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Authentication Policies</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input 
                        type="checkbox" 
                        checked={reqNumbers} 
                        onChange={e => setReqNumbers(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                      />
                      <span>Require numbers in passwords</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input 
                        type="checkbox" 
                        checked={reqSymbols} 
                        onChange={e => setReqSymbols(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                      />
                      <span>Require special symbols (e.g. @, #, $)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input 
                        type="checkbox" 
                        checked={reqUppercase} 
                        onChange={e => setReqUppercase(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                      />
                      <span>Require uppercase characters</span>
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)', marginBottom: '1rem' }}>
                      <input 
                        type="checkbox" 
                        checked={mfaEnabled} 
                        onChange={e => setMfaEnabled(e.target.checked)} 
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                      />
                      <span style={{ fontWeight: '500' }}>Enable Two-Factor Authentication (MFA)</span>
                    </label>
                    <div style={{ maxWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Session Timeout (minutes)</label>
                      <input required type="number" min="5" max="1440" value={sessionTimeout} onChange={e => setSessionTimeout(Number(e.target.value) || 30)} />
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} style={{ color: 'var(--primary)' }} /> Role Permission Matrix
                </h3>
                
                <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
                  <table className="glass-table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                      <tr>
                        <th>Role Name</th>
                        <th style={{ textAlign: 'center' }}>Read Action</th>
                        <th style={{ textAlign: 'center' }}>Write/Edit Action</th>
                        <th style={{ textAlign: 'center' }}>Delete Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rolesPermissions.map((rp: any, idx: number) => (
                        <tr key={rp.role}>
                          <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{rp.role}</td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={rp.read} 
                              disabled={rp.role === 'Administrator'} 
                              onChange={() => handleTogglePermission(idx, 'read')} 
                              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: rp.role === 'Administrator' ? 'not-allowed' : 'pointer' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={rp.write} 
                              disabled={rp.role === 'Administrator'} 
                              onChange={() => handleTogglePermission(idx, 'write')} 
                              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: rp.role === 'Administrator' ? 'not-allowed' : 'pointer' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={rp.delete} 
                              disabled={rp.role === 'Administrator'} 
                              onChange={() => handleTogglePermission(idx, 'delete')} 
                              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: rp.role === 'Administrator' ? 'not-allowed' : 'pointer' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Save size={16} /> Save Security Policies
                  </button>
                  {isSaved && <span style={{ color: 'var(--success)', fontWeight: '500', fontSize: '0.95rem' }}>✓ Policies updated successfully!</span>}
                </div>
              </form>
            </div>
          )}

          {/* ADMIN PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <User size={20} style={{ color: 'var(--primary)' }} /> Administrator Profile
              </h2>
              <p style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>Configure details of your user profile and login credentials.</p>

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full Name</label>
                    <input required type="text" value={adminName} onChange={e => setAdminName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                    <input required type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                  <Lock size={18} style={{ color: 'var(--secondary)' }} /> Change Account Password
                </h3>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>Leave these password fields blank if you do not wish to update your current password.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Password</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Save size={16} /> Save Profile Changes
                  </button>
                  {isSaved && <span style={{ color: 'var(--success)', fontWeight: '500', fontSize: '0.95rem' }}>✓ Profile saved successfully!</span>}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

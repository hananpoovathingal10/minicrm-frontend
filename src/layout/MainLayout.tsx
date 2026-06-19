import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Phone, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Megaphone, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Tv,
  ShieldCheck
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [appName, setAppName] = useState(() => localStorage.getItem('crm_app_name') || 'MiniCRM');
  const [adminName, setAdminName] = useState(() => localStorage.getItem('crm_admin_name') || 'System Administrator');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('crm_admin_email') || 'admin@example.com');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchWithAuth('/auth/profile');
        if (data && data.email) {
          if (!localStorage.getItem('crm_admin_email')) {
            localStorage.setItem('crm_admin_email', data.email);
          }
          setAdminEmail(localStorage.getItem('crm_admin_email') || data.email);
        }
      } catch (err) {
        console.error('Failed to load profile in layout', err);
      }
    };
    loadProfile();

    const handleSettingsChange = () => {
      setAppName(localStorage.getItem('crm_app_name') || 'MiniCRM');
      setAdminName(localStorage.getItem('crm_admin_name') || 'System Administrator');
      setAdminEmail(localStorage.getItem('crm_admin_email') || 'admin@example.com');
    };
    window.addEventListener('crm-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('crm-settings-changed', handleSettingsChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <h2 style={{ fontSize: '1.25rem', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          {appName}
        </h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1.5rem 1rem' }}>
          <div className="sidebar-logo-container" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {appName}
            </h2>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, marginBottom: '2rem' }}>
            <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/users" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Users size={18} />
              Users
            </NavLink>
            <NavLink to="/customers" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <UserCheck size={18} />
              Contacts
            </NavLink>
            <NavLink to="/phones" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Phone size={18} />
              Phones
            </NavLink>
            <NavLink to="/leads" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Target size={18} />
              Leads
            </NavLink>
            <NavLink to="/accounts" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Briefcase size={18} />
              Accounts
            </NavLink>
            <NavLink to="/opportunities" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <TrendingUp size={18} />
              Opportunities
            </NavLink>
            <NavLink to="/activities" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Calendar size={18} />
              Activities
            </NavLink>
            <NavLink to="/communications" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <MessageSquare size={18} />
              Communications
            </NavLink>
            <NavLink to="/campaigns" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Megaphone size={18} />
              Campaigns
            </NavLink>
            <NavLink to="/reports" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <BarChart3 size={18} />
              Reports
            </NavLink>
            <NavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Settings size={18} />
              Settings
            </NavLink>
            <NavLink to="/previews" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem' }}>
              <Tv size={18} />
              Device Previews
            </NavLink>
            <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ padding: '0.6rem 0.8rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <ShieldCheck size={18} />
              Admin Overview
            </NavLink>
          </nav>

          <div style={{ marginTop: 'auto', padding: '1rem 0 0.5rem 0', width: '100%', position: 'sticky', bottom: 0, background: 'rgba(9, 9, 11, 0.95)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{adminName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{adminEmail}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.6rem' }}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content" style={{ flex: 1, minHeight: '100vh' }}>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

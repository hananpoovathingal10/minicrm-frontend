import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Leads from './Leads';
import Login from './Login';
import { Monitor, Smartphone, Layout, Link2 } from 'lucide-react';

const Previews: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<'dashboard' | 'customers' | 'leads' | 'login'>('dashboard');

  const renderPage = () => {
    switch (selectedPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'leads':
        return <Leads />;
      case 'login':
        return <Login />;
      default:
        return <Dashboard />;
    }
  };

  const getPageUrl = () => {
    switch (selectedPage) {
      case 'dashboard': return '/';
      case 'customers': return '/customers';
      case 'leads': return '/leads';
      case 'login': return '/login';
    }
  };

  return (
    <div style={{ padding: '1rem 2rem', color: 'var(--text-main)' }}>
      {/* Page Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem', fontWeight: 700 }}>
            <Layout size={28} style={{ color: 'var(--primary)' }} />
            Device Previews
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Preview live CRM components side-by-side inside simulated desktop and mobile viewports.
          </p>
        </div>

        {/* Control Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Select Component:</span>
          <select 
            value={selectedPage} 
            onChange={(e: any) => setSelectedPage(e.target.value)}
            style={{ 
              background: 'rgba(30, 41, 59, 0.7)', 
              color: 'var(--text-main)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '0.5rem 1.5rem 0.5rem 1rem', 
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="dashboard">Dashboard Overview</option>
            <option value="customers">Contacts / Customers List</option>
            <option value="leads">Leads Tracker</option>
            <option value="login">Login View</option>
          </select>
        </div>
      </div>

      {/* Side-by-Side Previews Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 380px', 
        gap: '2.5rem', 
        alignItems: 'start',
        marginTop: '1rem'
      }}>
        
        {/* Desktop Viewport Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Monitor size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Simulated Desktop Browser</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(1200px scaled)</span>
          </div>

          {/* Browser Container Bezel */}
          <div style={{
            background: 'var(--panel-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            width: '100%',
            height: '425px', // container height to fit the scaled content
            position: 'relative'
          }}>
            {/* Browser Header Bar */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderBottom: '1px solid var(--border-color)',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              gap: '1rem'
            }}>
              {/* Window dots */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              </div>
              {/* Address bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                flex: 1,
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.75rem',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'monospace'
              }}>
                <Link2 size={12} />
                <span>http://localhost:5173{getPageUrl()}</span>
              </div>
            </div>

            {/* Scaled Desktop Web Page */}
            <div style={{
              width: '1200px',
              height: '800px',
              position: 'absolute',
              top: '40px',
              left: '0',
              transform: 'scale(0.48)', // scale 1200px down to ~576px width
              transformOrigin: 'top left',
              background: '#090d16',
              overflowY: 'auto',
              padding: '2rem'
            }}>
              {renderPage()}
            </div>
          </div>
        </div>

        {/* Mobile Viewport Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Smartphone size={18} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Simulated Smartphone</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(375px vertical)</span>
          </div>

          {/* Smartphone Frame Bezel */}
          <div style={{
            width: '320px',
            height: '425px',
            background: '#000',
            borderRadius: '24px',
            border: '8px solid #1e293b',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Phone Notch */}
            <div style={{
              width: '110px',
              height: '16px',
              background: '#1e293b',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              alignItems: 'center'
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#334155' }}></span>
              <span style={{ width: '20px', height: '3px', borderRadius: '2px', background: '#334155' }}></span>
            </div>

            {/* Inner Mobile Screen Content */}
            <div style={{
              flex: 1,
              background: '#090d16',
              padding: '1.5rem 1rem 1rem 1rem',
              overflowY: 'auto',
              fontSize: '0.85rem'
            }}>
              {/* Simulated Mobile Header bar for authentication pages if needed */}
              {selectedPage !== 'login' && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>MiniCRM</h4>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Mobile Live</span>
                </div>
              )}
              {renderPage()}
            </div>
            
            {/* Bottom Home Indicator Bar */}
            <div style={{
              height: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#000',
              zIndex: 10
            }}>
              <span style={{ width: '60px', height: '3px', borderRadius: '2px', background: '#334155' }}></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Previews;

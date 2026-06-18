import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Users, Target, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ customers: 0, leads: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, customers, leads] = await Promise.all([
          fetchWithAuth('/dashboard/stats'),
          fetchWithAuth('/customers'),
          fetchWithAuth('/leads')
        ]);
        
        setStats({
          customers: statsData.customers || 0,
          leads: statsData.leads || 0
        });

        // Compile recent activities
        
        // Take up to 3 most recent customers
        const recentCusts = (customers || []).slice(-3).reverse().map((c: any) => ({
          id: `cust-${c.id}`,
          type: 'customer',
          title: `New Customer: ${c.name}`,
          detail: c.company ? `Company: ${c.company}` : `Email: ${c.email}`
        }));
        
        // Take up to 3 most recent leads
        const recentLeads = (leads || []).slice(-3).reverse().map((l: any) => ({
          id: `lead-${l.id}`,
          type: 'lead',
          title: `New Lead: ${l.name}`,
          detail: `Status: ${l.status}`
        }));

        // Alternate or mix them and take top 5
        setRecentActivities([...recentCusts, ...recentLeads].slice(0, 5));

      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel stat-card-customers" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/customers')}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Total Customers</h3>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {isLoading ? '...' : stats.customers}
          </div>
        </div>

        <div className="glass-panel stat-card-leads" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/leads', { state: { filter: 'ACTIVE' } })}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Active Leads</h3>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--secondary)' }}>
              <Target size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {isLoading ? '...' : stats.leads}
          </div>
        </div>

        <div className="glass-panel stat-card-conversion" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/leads', { state: { filter: 'CONVERTED' } })}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Conversion Rate</h3>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--success)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {isLoading ? '...' : stats.customers && stats.leads ? Math.round((stats.customers / (stats.customers + stats.leads)) * 100) : stats.customers ? 100 : 0}%
          </div>
        </div>
        
        <div className="glass-panel stat-card-health" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>System Health</h3>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--success)' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success)' }}>
            Online
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
        {isLoading ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            Loading activity...
          </div>
        ) : recentActivities.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No recent activity to show.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map((act) => (
              <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: '500', marginBottom: '0.25rem' }}>{act.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{act.detail}</p>
                </div>
                <span className={`badge ${act.type === 'customer' ? 'badge-success' : 'badge-primary'}`}>
                  {act.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

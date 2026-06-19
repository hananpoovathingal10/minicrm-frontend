import React, { useEffect, useState } from 'react';
import { fetchWithAuth, API_BASE_URL } from '../services/api';
import { Users, Target, TrendingUp, Star, Globe, Phone, Share2, Mail, Zap } from 'lucide-react';

const sourceIcons: Record<string, React.ReactNode> = {
  'Interest Form': <Globe size={16} />,
  'Cold Call': <Phone size={16} />,
  'Referral': <Share2 size={16} />,
  'Website': <Globe size={16} />,
  'Campaign': <Mail size={16} />,
  'Other': <Zap size={16} />,
};

const sourceColors: Record<string, string> = {
  'Interest Form': '#6366f1',
  'Cold Call': '#ec4899',
  'Referral': '#10b981',
  'Website': '#f59e0b',
  'Campaign': '#8b5cf6',
  'Other': '#64748b',
};

function calcScore(lead: any): number {
  let score = 0;
  if (lead.name) score += 10;
  if (lead.email) score += 20;
  if (lead.phone) score += 15;
  if (lead.company) score += 15;
  if (lead.source === 'Interest Form') score += 20;
  if (lead.source === 'Referral') score += 15;
  if (lead.message) score += 10;
  if (lead.interest) score += 10;
  if (lead.status === 'CONTACTED') score += 10;
  return Math.min(score, 100);
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: '9999px', background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: '600', color, minWidth: '32px' }}>{score}</span>
    </div>
  );
}

const AdminOverview: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [captureLink] = useState(`${window.location.origin}/get-started`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [leadsData, customersData] = await Promise.all([
          fetchWithAuth('/leads'),
          fetchWithAuth('/customers'),
        ]);
        setLeads(leadsData || []);
        setCustomers(customersData || []);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(captureLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derived stats
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
  const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const formLeads = leads.filter(l => l.source === 'Interest Form').length;

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    const src = l.source || 'Other';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const maxSourceCount = Math.max(...Object.values(sourceCounts), 1);

  // Hot leads (score >= 60, not converted)
  const hotLeads = leads
    .filter(l => l.status !== 'CONVERTED')
    .map(l => ({ ...l, score: calcScore(l) }))
    .filter(l => l.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Recent form submissions
  const formSubmissions = leads
    .filter(l => l.source === 'Interest Form')
    .reverse()
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Admin Overview</h1>
          <p>Lead intelligence, pipeline health & capture link</p>
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px', padding: '0.75rem 1.25rem',
          }}
        >
          <Globe size={16} style={{ color: '#6366f1', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {captureLink}
          </span>
          <button
            onClick={copyLink}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Leads', value: isLoading ? '...' : totalLeads, icon: <Target size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Total Customers', value: isLoading ? '...' : customers.length, icon: <Users size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Conversion Rate', value: isLoading ? '...' : `${conversionRate}%`, icon: <TrendingUp size={20} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
          { label: 'Form Submissions', value: isLoading ? '...' : formLeads, icon: <Star size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', note: 'Auto-captured leads' },
        ].map(card => (
          <div key={card.label} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{card.label}</span>
              <div style={{ background: card.bg, color: card.color, padding: '0.4rem', borderRadius: '8px' }}>{card.icon}</div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)' }}>{card.value}</div>
            {card.note && <p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>{card.note}</p>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Lead Source Breakdown */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Lead Sources</h3>
          {isLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : Object.keys(sourceCounts).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No leads yet. Share your capture link to start!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, count]) => (
                <div key={src}>
                  <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      <span style={{ color: sourceColors[src] || '#64748b' }}>{sourceIcons[src] || <Zap size={16} />}</span>
                      {src}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: sourceColors[src] || '#64748b' }}>{count}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      style={{
                        width: `${(count / maxSourceCount) * 100}%`,
                        height: '100%',
                        borderRadius: '9999px',
                        background: sourceColors[src] || '#64748b',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Form Submissions */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Recent Form Submissions</h3>
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>Auto-captured</span>
          </div>
          {isLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : formSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>No form submissions yet.</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Share your capture link → visitors fill it → lead appears here automatically!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formSubmissions.map(l => (
                <div
                  key={l.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.05)',
                    border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-main)' }}>{l.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.email}</div>
                    {l.interest && <div style={{ fontSize: '0.75rem', color: '#6366f1', marginTop: '0.2rem' }}>🎯 {l.interest}</div>}
                  </div>
                  <span className={`badge ${l.status === 'CONVERTED' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.72rem' }}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hot Leads (by score) */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>🔥 Hot Leads — Prioritized by Score</h3>
            <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Scored based on data completeness & source quality. Follow up with high-score leads first.</p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Status</th>
                <th style={{ minWidth: '140px' }}>Lead Score</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : hotLeads.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No scored leads yet. Add leads or share the capture link.</td></tr>
              ) : (
                hotLeads.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{l.name}</td>
                    <td>{l.company || '-'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{l.email}</td>
                    <td>
                      <span className="badge badge-secondary" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: sourceColors[l.source] || '#94a3b8', borderColor: sourceColors[l.source] || undefined }}>
                        {sourceIcons[l.source] || <Zap size={12} />}
                        {l.source || 'Other'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>{l.interest || '-'}</td>
                    <td>
                      <span className={`badge ${l.status === 'NEW' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                        {l.status}
                      </span>
                    </td>
                    <td><ScoreBar score={l.score} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Share Link Section */}
      <div
        className="glass-panel"
        style={{
          marginTop: '1.5rem', padding: '2rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '1.1rem' }}>
            📣 Share your Lead Capture Page
          </h3>
          <p style={{ fontSize: '0.875rem' }}>
            Share this link on your website, WhatsApp, or social media. Every submission creates a lead automatically — zero manual work.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="/get-started"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ textDecoration: 'none', fontSize: '0.875rem' }}
          >
            Preview Page ↗
          </a>
          <button onClick={copyLink} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

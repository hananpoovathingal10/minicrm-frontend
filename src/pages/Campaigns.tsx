import React, { useState } from 'react';
import { Megaphone, Search, Plus, TrendingUp } from 'lucide-react';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([
    { id: 1, name: 'Q2 Tech Product Launch', type: 'Email Campaign', status: 'Active', budget: 5000, leads: 120 },
    { id: 2, name: 'Cold Call Outreach 2026', type: 'Telemarketing', status: 'Active', budget: 1500, leads: 45 },
    { id: 3, name: 'Summer Referral Promo', type: 'Referral', status: 'Planned', budget: 3000, leads: 0 },
    { id: 4, name: 'Google Ads Paid Search', type: 'Paid Search', status: 'Completed', budget: 10000, leads: 310 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newCamp, setNewCamp] = useState({ name: '', type: 'Email Campaign', status: 'Planned', budget: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const camp = {
      id: campaigns.length + 1,
      ...newCamp,
      leads: 0
    };
    setCampaigns([...campaigns, camp]);
    setShowModal(false);
    setNewCamp({ name: '', type: 'Email Campaign', status: 'Planned', budget: 0 });
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Marketing Campaigns</h1>
          <p>Track marketing campaigns, budget allocations, and performance leads counts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create Campaign
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Type</th>
                <th>Budget</th>
                <th>Leads Generated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
                      <Megaphone size={16} />
                    </div>
                    {c.name}
                  </td>
                  <td>{c.type}</td>
                  <td style={{ fontWeight: '500' }}>${c.budget.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: c.leads > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                      {c.leads > 0 && <TrendingUp size={12} />}
                      {c.leads} leads
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      c.status === 'Active' ? 'badge-success' :
                      c.status === 'Completed' ? 'badge-primary' : 'badge-secondary'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Campaign Name</label>
                <input required type="text" value={newCamp.name} onChange={e => setNewCamp({...newCamp, name: e.target.value})} placeholder="e.g. Email Newsletter Blast" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
                  <select value={newCamp.type} onChange={e => setNewCamp({...newCamp, type: e.target.value})} style={{ background: '#000' }}>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Telemarketing">Telemarketing</option>
                    <option value="Referral">Referral</option>
                    <option value="Paid Search">Paid Search</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                  <select value={newCamp.status} onChange={e => setNewCamp({...newCamp, status: e.target.value})} style={{ background: '#000' }}>
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Budget ($)</label>
                <input required type="number" value={newCamp.budget || ''} onChange={e => setNewCamp({...newCamp, budget: Number(e.target.value) || 0})} />
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;

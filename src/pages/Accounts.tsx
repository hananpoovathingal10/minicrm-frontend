import React, { useState } from 'react';
import { Building2, Search, Plus, Globe } from 'lucide-react';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([
    { id: 1, name: 'Acme Corporation', industry: 'Software & Technology', employees: '500-1000', location: 'San Francisco, CA', website: 'acme.com' },
    { id: 2, name: 'Global Industries', industry: 'Manufacturing', employees: '5000+', location: 'Chicago, IL', website: 'globalind.com' },
    { id: 3, name: 'Standard Tech', industry: 'Professional Services', employees: '50-100', location: 'Austin, TX', website: 'standardtech.co' },
    { id: 4, name: 'Delta Ventures', industry: 'Financial Services', employees: '200-500', location: 'New York, NY', website: 'deltaventures.com' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', industry: 'Software & Technology', employees: '50-100', location: '', website: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account = {
      id: accounts.length + 1,
      ...newAccount
    };
    setAccounts([...accounts, account]);
    setShowModal(false);
    setNewAccount({ name: '', industry: 'Software & Technology', employees: '50-100', location: '', website: '' });
  };

  const filteredAccounts = accounts.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Accounts</h1>
          <p>Manage customer organizations and client company profiles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Account
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search accounts..." 
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
                <th>Account Name</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Size (Employees)</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', padding: '0.4rem', borderRadius: '8px' }}>
                      <Building2 size={16} />
                    </div>
                    {a.name}
                  </td>
                  <td>{a.industry}</td>
                  <td>{a.location || '-'}</td>
                  <td>
                    <span className="badge badge-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                      {a.employees}
                    </span>
                  </td>
                  <td>
                    {a.website ? (
                      <a href={`https://${a.website}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Globe size={12} /> {a.website}
                      </a>
                    ) : '-'}
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
            <h2 style={{ marginBottom: '1.5rem' }}>Create Company Account</h2>
            <form onSubmit={handleCreateAccount}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company Name</label>
                <input required type="text" value={newAccount.name} onChange={e => setNewAccount({...newAccount, name: e.target.value})} placeholder="e.g. Wayne Enterprises" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Industry</label>
                  <select value={newAccount.industry} onChange={e => setNewAccount({...newAccount, industry: e.target.value})} style={{ background: '#000' }}>
                    <option value="Software & Technology">Software & Tech</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Employees</label>
                  <select value={newAccount.employees} onChange={e => setNewAccount({...newAccount, employees: e.target.value})} style={{ background: '#000' }}>
                    <option value="1-10">1-10</option>
                    <option value="10-50">10-50</option>
                    <option value="50-200">50-200</option>
                    <option value="200-1000">200-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Location</label>
                <input type="text" value={newAccount.location} onChange={e => setNewAccount({...newAccount, location: e.target.value})} placeholder="e.g. Seattle, WA" />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Website URL</label>
                <input type="text" value={newAccount.website} onChange={e => setNewAccount({...newAccount, website: e.target.value})} placeholder="e.g. wayne.com" />
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

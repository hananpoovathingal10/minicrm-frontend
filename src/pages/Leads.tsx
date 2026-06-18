import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Plus, Search, Edit2, Trash2, UserCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const location = useLocation();
  const initialFilter = (location.state as any)?.filter || 'ALL';
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'NEW' | 'CONTACTED' | 'CONVERTED'>(initialFilter);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', status: 'NEW', company: '', source: 'Website', value: 0 });
  const [editingLead, setEditingLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await fetchWithAuth('/leads');
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadPayload = {
        ...newLead,
        value: Number(newLead.value) || 0
      };
      await fetchWithAuth('/leads', {
        method: 'POST',
        body: JSON.stringify(leadPayload)
      });
      setShowModal(false);
      setNewLead({ name: '', email: '', phone: '', status: 'NEW', company: '', source: 'Website', value: 0 });
      loadLeads();
    } catch (err) {
      console.error('Failed to add lead', err);
    }
  };

  const handleEditClick = (lead: any) => {
    setEditingLead({ ...lead });
    setShowEditModal(true);
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = editingLead;
      const leadPayload = {
        ...updateData,
        value: Number(updateData.value) || 0
      };
      await fetchWithAuth(`/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(leadPayload)
      });
      setShowEditModal(false);
      setEditingLead(null);
      loadLeads();
    } catch (err) {
      console.error('Failed to update lead', err);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await fetchWithAuth(`/leads/${id}`, {
        method: 'DELETE'
      });
      loadLeads();
    } catch (err) {
      console.error('Failed to delete lead', err);
    }
  };

  const handleConvertLead = async (id: number) => {
    try {
      await fetchWithAuth(`/leads/${id}/convert`, {
        method: 'POST'
      });
      loadLeads();
    } catch (err) {
      console.error('Failed to convert lead', err);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetchWithAuth(`/leads/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      loadLeads();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTIVE') return l.status === 'NEW' || l.status === 'CONTACTED';
    return l.status === filterTab;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Leads Pipeline</h1>
          <p>Track potential customers and sales opportunities</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${filterTab === 'ALL' ? 'active' : ''}`} onClick={() => setFilterTab('ALL')}>
          All Leads
        </button>
        <button className={`tab-btn ${filterTab === 'ACTIVE' ? 'active' : ''}`} onClick={() => setFilterTab('ACTIVE')}>
          Active Leads
        </button>
        <button className={`tab-btn ${filterTab === 'NEW' ? 'active' : ''}`} onClick={() => setFilterTab('NEW')}>
          New
        </button>
        <button className={`tab-btn ${filterTab === 'CONTACTED' ? 'active' : ''}`} onClick={() => setFilterTab('CONTACTED')}>
          Contacted
        </button>
        <button className={`tab-btn ${filterTab === 'CONVERTED' ? 'active' : ''}`} onClick={() => setFilterTab('CONVERTED')}>
          Converted
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search leads..." 
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
                <th>Lead Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Est. Value</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No leads found</td></tr>
              ) : (
                filteredLeads.map((l) => (
                  <tr key={l.id || l._id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{l.name}</td>
                    <td>{l.company || '-'}</td>
                    <td>{l.email}</td>
                    <td>{l.phone || '-'}</td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                        {l.source || 'Website'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500', color: 'var(--success)' }}>
                      ${l.value?.toLocaleString() || '0'}
                    </td>
                    <td>
                      <span className={`badge badge-${l.status === 'NEW' ? 'primary' : l.status === 'CONTACTED' ? 'warning' : 'success'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={l.status}
                        onChange={(e) => updateStatus(l.id || l._id, e.target.value)}
                        style={{ padding: '0.25rem', width: 'auto', background: 'transparent' }}
                      >
                        <option value="NEW" style={{ color: '#000' }}>New</option>
                        <option value="CONTACTED" style={{ color: '#000' }}>Contacted</option>
                        <option value="CONVERTED" style={{ color: '#000' }}>Converted</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {l.status !== 'CONVERTED' && (
                          <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }} onClick={() => handleConvertLead(l.id)} title="Convert to Customer">
                            <UserCheck size={14} />
                          </button>
                        )}
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }} onClick={() => handleEditClick(l)} title="Edit Lead">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDeleteLead(l.id)} title="Delete Lead">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Lead</h2>
            <form onSubmit={handleAddLead}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                <input required type="text" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone</label>
                  <input type="text" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company</label>
                  <input type="text" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Source</label>
                  <select value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})} style={{ background: '#000' }}>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Est. Value ($)</label>
                  <input type="number" value={newLead.value || ''} onChange={e => setNewLead({...newLead, value: Number(e.target.value) || 0})} />
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Edit Lead</h2>
            <form onSubmit={handleUpdateLead}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                <input required type="text" value={editingLead.name} onChange={e => setEditingLead({...editingLead, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" value={editingLead.email} onChange={e => setEditingLead({...editingLead, email: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone</label>
                  <input type="text" value={editingLead.phone || ''} onChange={e => setEditingLead({...editingLead, phone: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company</label>
                  <input type="text" value={editingLead.company || ''} onChange={e => setEditingLead({...editingLead, company: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Source</label>
                  <select value={editingLead.source || 'Website'} onChange={e => setEditingLead({...editingLead, source: e.target.value})} style={{ background: '#000' }}>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Est. Value ($)</label>
                  <input type="number" value={editingLead.value || ''} onChange={e => setEditingLead({...editingLead, value: Number(e.target.value) || 0})} />
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                <select value={editingLead.status} onChange={e => setEditingLead({...editingLead, status: e.target.value})} style={{ background: '#000' }}>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONVERTED">Converted</option>
                </select>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => { setShowEditModal(false); setEditingLead(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;

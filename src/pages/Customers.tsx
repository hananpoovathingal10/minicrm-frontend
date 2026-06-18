import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', company: '', status: 'Active', tier: 'Standard' });
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await fetchWithAuth('/customers');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/customers', {
        method: 'POST',
        body: JSON.stringify(newCustomer)
      });
      setShowModal(false);
      setNewCustomer({ name: '', email: '', phone: '', company: '', status: 'Active', tier: 'Standard' });
      loadCustomers();
    } catch (err) {
      console.error('Failed to add customer', err);
    }
  };

  const handleEditClick = (customer: any) => {
    setEditingCustomer({ ...customer });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = editingCustomer;
      await fetchWithAuth(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      setShowEditModal(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (err) {
      console.error('Failed to update customer', err);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await fetchWithAuth(`/customers/${id}`, {
        method: 'DELETE'
      });
      loadCustomers();
    } catch (err) {
      console.error('Failed to delete customer', err);
    }
  };

  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Customers</h1>
          <p>Manage your client relationships</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search customers..." 
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
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customers found</td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id || c._id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{c.name}</td>
                    <td>{c.company || '-'}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '-'}</td>
                    <td>
                      <span className={`badge ${
                        c.tier === 'Enterprise' ? 'badge-tier-enterprise' :
                        c.tier === 'Premium' ? 'badge-tier-premium' : 'badge-tier-standard'
                      }`}>
                        {c.tier || 'Standard'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'Inactive' ? 'badge-secondary' : 'badge-success'}`}>
                        {c.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }} onClick={() => handleEditClick(c)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDeleteCustomer(c.id)}>
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
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Customer</h2>
            <form onSubmit={handleAddCustomer}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                <input required type="text" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone</label>
                <input type="text" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company</label>
                <input type="text" value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tier</label>
                  <select value={newCustomer.tier} onChange={e => setNewCustomer({...newCustomer, tier: e.target.value})} style={{ background: '#000' }}>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                  <select value={newCustomer.status} onChange={e => setNewCustomer({...newCustomer, status: e.target.value})} style={{ background: '#000' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                <input required type="text" value={editingCustomer.name} onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" value={editingCustomer.email} onChange={e => setEditingCustomer({...editingCustomer, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone</label>
                <input type="text" value={editingCustomer.phone || ''} onChange={e => setEditingCustomer({...editingCustomer, phone: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company</label>
                <input type="text" value={editingCustomer.company || ''} onChange={e => setEditingCustomer({...editingCustomer, company: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tier</label>
                  <select value={editingCustomer.tier || 'Standard'} onChange={e => setEditingCustomer({...editingCustomer, tier: e.target.value})} style={{ background: '#000' }}>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                  <select value={editingCustomer.status || 'Active'} onChange={e => setEditingCustomer({...editingCustomer, status: e.target.value})} style={{ background: '#000' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => { setShowEditModal(false); setEditingCustomer(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

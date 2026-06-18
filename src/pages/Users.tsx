import React, { useState } from 'react';
import { Plus, Shield, Mail, Search, Trash2 } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([
    { id: 1, name: 'System Administrator', email: 'admin@example.com', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Hanan Qureshi', email: 'hanan@gmail.com', role: 'Sales Agent', status: 'Active' },
    { id: 3, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Support Specialist', status: 'Active' },
    { id: 4, name: 'John Doe', email: 'john@example.com', role: 'Sales Manager', status: 'Inactive' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Sales Agent' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...newUser,
      status: 'Active'
    };
    setUsers([...users, user]);
    setShowModal(false);
    setNewUser({ name: '', email: '', role: 'Sales Agent' });
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Team Members</h1>
          <p>Invite and manage roles for administrators, agents, and managers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search members..." 
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
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={14} style={{ color: u.role === 'Administrator' ? 'var(--secondary)' : 'var(--primary)' }} />
                      {u.role}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.35rem 0.5rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '6px' }}
                      onClick={() => handleDeleteUser(u.id)}
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
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
            <h2 style={{ marginBottom: '1.5rem' }}>Invite Team Member</h2>
            <form onSubmit={handleInviteUser}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="e.g. Alice Cooper" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="e.g. alice@example.com" />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ background: '#000' }}>
                  <option value="Sales Agent">Sales Agent</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Support Specialist">Support Specialist</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

import React, { useState } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, Search, Plus } from 'lucide-react';

const Phones: React.FC = () => {
  const [callLogs, setCallLogs] = useState<any[]>([
    { id: 1, contact: 'Test Customer', type: 'Outbound', date: '3/26/2026 5:04 PM', duration: '5m 12s', status: 'Completed', phone: '99999' },
    { id: 2, contact: 'Alice Smith', type: 'Inbound', date: '3/25/2026 12:45 PM', duration: '2m 30s', status: 'Completed', phone: '123456789' },
    { id: 3, contact: 'Test Lead', type: 'Outbound', date: '3/25/2026 10:15 AM', duration: '0s', status: 'No Answer', phone: '88888' },
    { id: 4, contact: 'Bob Johnson', type: 'Inbound', date: '3/24/2026 4:30 PM', duration: '0s', status: 'Missed', phone: '5551234' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newCall, setNewCall] = useState({ contact: '', phone: '', type: 'Outbound', duration: '1m 30s', status: 'Completed' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    const log = {
      id: callLogs.length + 1,
      ...newCall,
      date: new Date().toLocaleString()
    };
    setCallLogs([log, ...callLogs]);
    setShowModal(false);
    setNewCall({ contact: '', phone: '', type: 'Outbound', duration: '1m 30s', status: 'Completed' });
  };

  const filteredLogs = callLogs.filter(c =>
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Phone Call Logs</h1>
          <p>View call activity history, talk duration, and customer dialing channels</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Log Call
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Calls</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem' }}>{callLogs.length}</div>
          </div>
          <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
            <Phone size={20} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Inbound Calls</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem' }}>
              {callLogs.filter(c => c.type === 'Inbound').length}
            </div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--success)' }}>
            <PhoneIncoming size={20} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Outbound Calls</h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.25rem' }}>
              {callLogs.filter(c => c.type === 'Outbound').length}
            </div>
          </div>
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--secondary)' }}>
            <PhoneOutgoing size={20} />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search call logs..." 
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
                <th>Contact Name</th>
                <th>Phone Number</th>
                <th>Call Type</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{log.contact}</td>
                  <td>{log.phone}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: log.type === 'Inbound' ? 'var(--success)' : 'var(--primary)' }}>
                      {log.type === 'Inbound' ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />}
                      {log.type}
                    </div>
                  </td>
                  <td>{log.date}</td>
                  <td>{log.duration}</td>
                  <td>
                    <span className={`badge ${
                      log.status === 'Completed' ? 'badge-success' :
                      log.status === 'No Answer' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {log.status}
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
            <h2 style={{ marginBottom: '1.5rem' }}>Log Phone Call</h2>
            <form onSubmit={handleLogCall}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Contact Name</label>
                <input required type="text" value={newCall.contact} onChange={e => setNewCall({...newCall, contact: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label>
                <input required type="text" value={newCall.phone} onChange={e => setNewCall({...newCall, phone: e.target.value})} placeholder="e.g. 555-0199" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Call Type</label>
                  <select value={newCall.type} onChange={e => setNewCall({...newCall, type: e.target.value})} style={{ background: '#000' }}>
                    <option value="Outbound">Outbound</option>
                    <option value="Inbound">Inbound</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                  <select value={newCall.status} onChange={e => setNewCall({...newCall, status: e.target.value})} style={{ background: '#000' }}>
                    <option value="Completed">Completed</option>
                    <option value="No Answer">No Answer</option>
                    <option value="Missed">Missed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phones;

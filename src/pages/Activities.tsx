import React, { useState } from 'react';
import { Search, Plus, Clock } from 'lucide-react';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ subject: '', type: 'Call', dueDate: '', priority: 'Medium', status: 'Pending' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const act = {
      id: activities.length + 1,
      ...newActivity
    };
    setActivities([act, ...activities]);
    setShowModal(false);
    setNewActivity({ subject: '', type: 'Call', dueDate: '', priority: 'Medium', status: 'Pending' });
  };

  const handleToggleStatus = (id: number) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, status: a.status === 'Completed' ? 'Pending' : 'Completed' } : a
    ));
  };

  const filteredActivities = activities.filter(a =>
    a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Activities & Tasks</h1>
          <p>Schedule and monitor customer follow-up calls, emails, and tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
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
                <th style={{ width: '40px' }}>Done</th>
                <th>Subject</th>
                <th>Task Type</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                    No tasks scheduled. Click "New Task" to begin!
                  </td>
                </tr>
              ) : (
                filteredActivities.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={a.status === 'Completed'} 
                        onChange={() => handleToggleStatus(a.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ fontWeight: '500', color: a.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: a.status === 'Completed' ? 'line-through' : 'none' }}>
                      {a.subject}
                    </td>
                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                        {a.type}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                        <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                        {a.dueDate || '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        a.priority === 'High' ? 'badge-warning' :
                        a.priority === 'Critical' ? 'badge-warning' : 'badge-primary'
                      }`} style={{ background: a.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : undefined, color: a.priority === 'High' ? 'var(--danger)' : undefined, borderColor: a.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : undefined }}>
                        {a.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${a.status === 'Completed' ? 'badge-success' : 'badge-secondary'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Schedule New Task</h2>
            <form onSubmit={handleCreateActivity}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Subject / Title</label>
                <input required type="text" value={newActivity.subject} onChange={e => setNewActivity({...newActivity, subject: e.target.value})} placeholder="e.g. Outbound call to Acme Corp" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
                  <select value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value})} style={{ background: '#000' }}>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Priority</label>
                  <select value={newActivity.priority} onChange={e => setNewActivity({...newActivity, priority: e.target.value})} style={{ background: '#000' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Due Date</label>
                <input required type="date" value={newActivity.dueDate} onChange={e => setNewActivity({...newActivity, dueDate: e.target.value})} />
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;

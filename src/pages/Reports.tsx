import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Plus, Search, Play, Edit2, Trash2, BarChart3, ArrowUpRight } from 'lucide-react';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newReport, setNewReport] = useState({ name: '', type: 'Sales', schedule: 'monthly', status: 'ACTIVE' });
  const [editingReport, setEditingReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await fetchWithAuth('/reports');
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/reports', {
        method: 'POST',
        body: JSON.stringify(newReport)
      });
      setShowModal(false);
      setNewReport({ name: '', type: 'Sales', schedule: 'monthly', status: 'ACTIVE' });
      loadReports();
    } catch (err) {
      console.error('Failed to add report', err);
    }
  };

  const handleEditClick = (report: any) => {
    setEditingReport({ ...report });
    setShowEditModal(true);
  };

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...updateData } = editingReport;
      await fetchWithAuth(`/reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      setShowEditModal(false);
      setEditingReport(null);
      loadReports();
    } catch (err) {
      console.error('Failed to update report', err);
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await fetchWithAuth(`/reports/${id}`, {
        method: 'DELETE'
      });
      loadReports();
    } catch (err) {
      console.error('Failed to delete report', err);
    }
  };

  const handleRunReport = async (id: number) => {
    try {
      await fetchWithAuth(`/reports/${id}/run`, {
        method: 'POST'
      });
      alert('Report executed successfully!');
      loadReports();
    } catch (err) {
      console.error('Failed to run report', err);
    }
  };

  const filteredReports = reports.filter(r =>
    (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Reports & Analytics</h1>
          <p>Analyze calling metrics, leads conversions, and agent performances</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create Report
        </button>
      </div>

      {/* Reports Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel stat-card-customers" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Total Reports</h3>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700' }}>
            {reports.length}
          </div>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Available templates</p>
        </div>

        <div className="glass-panel stat-card-conversion" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Active Reports</h3>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--success)' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700' }}>
            {reports.filter(r => r.status === 'ACTIVE').length}
          </div>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Active scheduling</p>
        </div>

        <div className="glass-panel stat-card-leads" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>This Week</h3>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--secondary)' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700' }}>0</div>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>New reports this week</p>
        </div>

        <div className="glass-panel stat-card-customers" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Total Views</h3>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700' }}>37</div>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Reports views count</p>
        </div>
      </div>

      {/* Live Reports Selection Cards */}
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-main)' }}>Live Reports</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <BarChart3 size={20} />
            </div>
            <h4 style={{ color: 'var(--text-main)' }}>Inbound Report by DID</h4>
          </div>
          <p style={{ fontSize: '0.85rem' }}>Inbound call stats with DID and shift filters.</p>
          <button className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Opening Inbound Calling Report...')}>
            Open Report
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--success)' }}>
              <BarChart3 size={20} />
            </div>
            <h4 style={{ color: 'var(--text-main)' }}>Outbound Calling Report</h4>
          </div>
          <p style={{ fontSize: '0.85rem' }}>Outbound call report by campaign, list, and status.</p>
          <button className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Opening Outbound Calling Report...')}>
            Open Report
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--warning)' }}>
              <BarChart3 size={20} />
            </div>
            <h4 style={{ color: 'var(--text-main)' }}>Real-time Main Report</h4>
          </div>
          <p style={{ fontSize: '0.85rem' }}>Live agent statuses and queue snapshot with auto-refresh.</p>
          <button className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Opening Real-time Main Report...')}>
            Open Report
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--secondary)' }}>
              <BarChart3 size={20} />
            </div>
            <h4 style={{ color: 'var(--text-main)' }}>Custom Calling Report</h4>
          </div>
          <p style={{ fontSize: '0.85rem' }}>Call history by agent, campaign or in-group, status and phone number.</p>
          <button className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Opening Custom Calling Report...')}>
            Open Report
          </button>
        </div>
      </div>

      {/* Reports Table list */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search reports..." 
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
                <th>Report Name</th>
                <th>Type</th>
                <th>Schedule</th>
                <th>Last Run</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : filteredReports.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reports found</td></tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{r.name}</td>
                    <td>
                      <span className="badge badge-primary" style={{ padding: '0.2rem 0.5rem' }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{r.schedule}</td>
                    <td>{r.lastRun || '-'}</td>
                    <td>
                      <span className={`badge ${r.status === 'ACTIVE' ? 'badge-success' : 'badge-secondary'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.createdBy}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', color: 'var(--success)' }} onClick={() => handleRunReport(r.id)} title="Run Report">
                          <Play size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }} onClick={() => handleEditClick(r)} title="Edit Report">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDeleteReport(r.id)} title="Delete Report">
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Report</h2>
            <form onSubmit={handleAddReport}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Report Name</label>
                <input required type="text" value={newReport.name} onChange={e => setNewReport({...newReport, name: e.target.value})} placeholder="e.g. Call logs summary" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
                  <select value={newReport.type} onChange={e => setNewReport({...newReport, type: e.target.value})} style={{ background: '#000' }}>
                    <option value="Sales">Sales</option>
                    <option value="Leads">Leads</option>
                    <option value="Activities">Activities</option>
                    <option value="Performance">Performance</option>
                    <option value="Contacts">Contacts</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Schedule</label>
                  <select value={newReport.schedule} onChange={e => setNewReport({...newReport, schedule: e.target.value})} style={{ background: '#000' }}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Edit Report</h2>
            <form onSubmit={handleUpdateReport}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Report Name</label>
                <input required type="text" value={editingReport.name} onChange={e => setEditingReport({...editingReport, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
                  <select value={editingReport.type} onChange={e => setEditingReport({...editingReport, type: e.target.value})} style={{ background: '#000' }}>
                    <option value="Sales">Sales</option>
                    <option value="Leads">Leads</option>
                    <option value="Activities">Activities</option>
                    <option value="Performance">Performance</option>
                    <option value="Contacts">Contacts</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Schedule</label>
                  <select value={editingReport.schedule} onChange={e => setEditingReport({...editingReport, schedule: e.target.value})} style={{ background: '#000' }}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => { setShowEditModal(false); setEditingReport(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

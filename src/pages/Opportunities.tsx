import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Plus, DollarSign, Calendar, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

const STAGES = ['Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOpp, setNewOpp] = useState({ title: '', company: '', value: 0, stage: 'Qualification', closeDate: '' });

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      const data = await fetchWithAuth('/opportunities');
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load opportunities', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/opportunities', {
        method: 'POST',
        body: JSON.stringify({
          ...newOpp,
          value: Number(newOpp.value) || 0
        })
      });
      setShowModal(false);
      setNewOpp({ title: '', company: '', value: 0, stage: 'Qualification', closeDate: '' });
      loadOpportunities();
    } catch (err) {
      console.error('Failed to add opportunity', err);
    }
  };

  const handleMoveStage = async (id: number, currentStage: string, direction: 'left' | 'right') => {
    const currentIndex = STAGES.indexOf(currentStage);
    let newIndex = currentIndex;
    if (direction === 'left' && currentIndex > 0) newIndex--;
    if (direction === 'right' && currentIndex < STAGES.length - 1) newIndex++;
    
    if (newIndex === currentIndex) return;

    try {
      await fetchWithAuth(`/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ stage: STAGES[newIndex] })
      });
      loadOpportunities();
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  const handleDeleteOpp = async (id: number) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      await fetchWithAuth(`/opportunities/${id}`, {
        method: 'DELETE'
      });
      loadOpportunities();
    } catch (err) {
      console.error('Failed to delete opportunity', err);
    }
  };

  const totalPipelineValue = opportunities.reduce((acc, curr) => acc + (curr.stage !== 'Lost' ? curr.value : 0), 0);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Opportunities Pipeline</h1>
          <p>Track deals, deal values, and close timelines across stages</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Opportunity
        </button>
      </div>

      {/* Summary Value Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', maxWidth: '350px' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--success)' }}>
          <DollarSign size={28} />
        </div>
        <div>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Active Pipeline Value</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>
            ${totalPipelineValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Kanban Stages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.stage === stage);
          const stageSum = stageOpps.reduce((acc, curr) => acc + curr.value, 0);

          return (
            <div key={stage} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)' }}>
              <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{stage}</h4>
                <span className="badge badge-secondary" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>
                  {stageOpps.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px' }}>
                {isLoading ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading...</p>
                ) : stageOpps.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No deals</p>
                ) : (
                  stageOpps.map((opp) => (
                    <div key={opp.id} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', position: 'relative' }}>
                      <h5 style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{opp.title}</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{opp.company}</p>
                      
                      <div className="flex-between" style={{ marginTop: '1rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--success)', fontSize: '0.9rem' }}>
                          ${opp.value.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                          <Calendar size={12} /> {opp.closeDate}
                        </span>
                      </div>

                      <div className="flex-between" style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                        <button className="btn btn-outline" style={{ padding: '0.2rem 0.4rem', borderRadius: '4px' }} disabled={stage === STAGES[0]} onClick={() => handleMoveStage(opp.id, stage, 'left')}>
                          <ChevronLeft size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--danger)' }} onClick={() => handleDeleteOpp(opp.id)}>
                          <Trash2 size={12} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.2rem 0.4rem', borderRadius: '4px' }} disabled={stage === STAGES[STAGES.length - 1]} onClick={() => handleMoveStage(opp.id, stage, 'right')}>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {stageSum > 0 && (
                  <div style={{ marginTop: 'auto', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                    Sum: <span style={{ color: 'var(--text-main)' }}>${stageSum.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Opportunity</h2>
            <form onSubmit={handleAddOpp}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Deal Title</label>
                <input required type="text" value={newOpp.title} onChange={e => setNewOpp({...newOpp, title: e.target.value})} placeholder="e.g. Enterprise License Expansion" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Company</label>
                <input required type="text" value={newOpp.company} onChange={e => setNewOpp({...newOpp, company: e.target.value})} placeholder="e.g. Initech Corp" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Deal Value ($)</label>
                  <input required type="number" value={newOpp.value || ''} onChange={e => setNewOpp({...newOpp, value: Number(e.target.value) || 0})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Close Date</label>
                  <input required type="date" value={newOpp.closeDate} onChange={e => setNewOpp({...newOpp, closeDate: e.target.value})} />
                </div>
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;

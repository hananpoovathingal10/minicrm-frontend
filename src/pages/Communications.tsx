import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';

const Communications: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, contact: 'Test Customer', subject: 'Invoice Query #4991', date: '3/26/2026 5:04 PM', body: 'Hi, I received the billing sheet but the company VAT ID is missing. Could you please update and send it again?', read: false },
    { id: 2, contact: 'Sarah Connor', subject: 'Re: Technical Onboarding Call', date: '3/25/2026 2:10 PM', body: 'The meeting schedule works for us. Our engineers will join the call at 3:00 PM CST tomorrow.', read: true },
    { id: 3, contact: 'Alice Smith', subject: 'Product Demo Interest', date: '3/25/2026 11:30 AM', body: 'I saw the product overview on your website. Can we schedule a brief demo call next Tuesday?', read: true },
  ]);
  const [activeMessage, setActiveMessage] = useState<any>(messages[0]);
  const [showModal, setShowModal] = useState(false);
  const [newMail, setNewMail] = useState({ contact: '', subject: '', body: '' });

  const handleComposeMail = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = {
      id: messages.length + 1,
      contact: newMail.contact,
      subject: newMail.subject,
      body: newMail.body,
      date: new Date().toLocaleString(),
      read: true
    };
    setMessages([mail, ...messages]);
    setActiveMessage(mail);
    setShowModal(false);
    setNewMail({ contact: '', subject: '', body: '' });
  };

  const handleSelectMessage = (msg: any) => {
    setMessages(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
    setActiveMessage({ ...msg, read: true });
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Communications Inbox</h1>
          <p>Read customer emails, queries, and send mock updates to contacts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Compose Email
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Messages List Sidebar */}
        <div className="glass-panel" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>
            Inbox ({messages.filter(m => !m.read).length} unread)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {messages.map((m) => (
              <div 
                key={m.id} 
                onClick={() => handleSelectMessage(m)}
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid var(--border-color)', 
                  cursor: 'pointer',
                  background: activeMessage?.id === m.id ? 'var(--primary-light)' : m.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderLeft: !m.read ? '3px solid var(--primary)' : 'none',
                  transition: 'background 0.2s'
                }}
              >
                <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: m.read ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: m.read ? '500' : '600' }}>{m.contact}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.date.split(' ')[0]}</span>
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: m.read ? 'normal' : '600', color: m.read ? 'var(--text-muted)' : 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>{m.subject}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Viewer Details */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          {activeMessage ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{activeMessage.subject}</h2>
                <div className="flex-between">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>From: </span>
                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{activeMessage.contact}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeMessage.date}</span>
                </div>
              </div>
              <div style={{ flex: 1, whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-main)', fontSize: '1.05rem', overflowY: 'auto' }}>
                {activeMessage.body}
              </div>
            </div>
          ) : (
            <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
              Select a message from the list to read it.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'var(--bg-dark)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Compose Email</h2>
            <form onSubmit={handleComposeMail}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Recipient Name / Email</label>
                <input required type="text" value={newMail.contact} onChange={e => setNewMail({...newMail, contact: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Subject</label>
                <input required type="text" value={newMail.subject} onChange={e => setNewMail({...newMail, subject: e.target.value})} placeholder="e.g. Follow-up Proposal Details" />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message Body</label>
                <textarea required rows={6} value={newMail.body} onChange={e => setNewMail({...newMail, body: e.target.value})} placeholder="Write your message here..." style={{ resize: 'none' }} />
              </div>
              
              <div className="flex-between">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Send size={16} /> Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communications;

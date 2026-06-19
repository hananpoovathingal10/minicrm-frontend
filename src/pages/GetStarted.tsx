import React, { useState } from 'react';
import { API_BASE_URL } from '../services/api';

const interestOptions = [
  'Sales Automation',
  'Lead Management',
  'Customer Tracking',
  'Campaign Management',
  'Reports & Analytics',
  'Team Collaboration',
  'Other',
];

const GetStarted: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/leads/public-capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          source: 'Interest Form',
          message: form.message,
          interest: form.interest,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Submission failed. Please try again.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, rgba(99,102,241,0.2), transparent 50%), radial-gradient(circle at bottom right, rgba(16,185,129,0.15), transparent 50%), #09090b',
          padding: '2rem',
        }}
      >
        <div
          className="glass-panel animate-fade-in"
          style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center' }}
        >
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>You're on the list! 🎉</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
            Thank you, <strong style={{ color: 'var(--text-main)' }}>{form.name}</strong>! We've received your interest.
            Our team will reach out to you at <strong style={{ color: 'var(--primary)' }}>{form.email}</strong> very soon.
          </p>
          <div
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            💡 While you wait, explore how MiniCRM helps businesses grow their customer base and close more deals.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top right, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at bottom left, rgba(236,72,153,0.12), transparent 45%), #09090b',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Hero Header */}
      <header style={{ textAlign: 'center', padding: '4rem 2rem 2rem' }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '9999px', padding: '0.4rem 1.2rem', marginBottom: '1.5rem',
            fontSize: '0.85rem', color: '#a5b4fc',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Now accepting new businesses
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #fff 30%, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}
        >
          Grow Your Business<br />with MiniCRM
        </h1>
        <p
          style={{
            color: '#94a3b8', fontSize: '1.15rem', maxWidth: '560px',
            margin: '0 auto 1rem', lineHeight: 1.7,
          }}
        >
          Tell us about your business and we'll show you how MiniCRM can help you capture more leads, close more deals, and grow faster.
        </p>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', margin: '2rem 0', flexWrap: 'wrap' }}>
          {[
            { value: '3x', label: 'More Leads' },
            { value: '60%', label: 'Less Manual Work' },
            { value: '10min', label: 'Setup Time' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#6366f1' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Form */}
      <main style={{ display: 'flex', justifyContent: 'center', padding: '0 1rem 4rem' }}>
        <div
          className="glass-panel animate-fade-in"
          style={{ width: '100%', maxWidth: '560px', padding: '2.5rem' }}
        >
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Get Started — It's Free</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>Our team will contact you within 24 hours.</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name + Company */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                  Full Name *
                </label>
                <input id="gs-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                  Company Name
                </label>
                <input id="gs-company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Acme Corp" />
              </div>
            </div>

            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                  Email Address *
                </label>
                <input id="gs-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                  Phone Number
                </label>
                <input id="gs-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
              </div>
            </div>

            {/* Interest */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                What are you most interested in? *
              </label>
              <select id="gs-interest" name="interest" value={form.interest} onChange={handleChange} required style={{ background: 'rgba(0,0,0,0.3)' }}>
                <option value="">Select an area...</option>
                {interestOptions.map(opt => (
                  <option key={opt} value={opt} style={{ background: '#111' }}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                Tell us about your business (optional)
              </label>
              <textarea
                id="gs-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Briefly describe your business and what challenges you face..."
                rows={3}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <button
              id="gs-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Submitting...
                </span>
              ) : (
                '🚀 Get Started — It\'s Free'
              )}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
              No spam. No credit card required. We'll reach out within 24 hours.
            </p>
          </form>
        </div>
      </main>

      {/* Feature Highlights */}
      <section style={{ padding: '0 2rem 4rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h3 style={{ textAlign: 'center', color: '#f8fafc', marginBottom: '2rem', fontSize: '1.3rem' }}>
          Why companies choose MiniCRM
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '🎯', title: 'Auto Lead Capture', desc: 'This form automatically creates a lead in your CRM — no manual entry needed.' },
            { icon: '📊', title: 'Lead Scoring', desc: 'Every lead gets a score so your team knows who to contact first.' },
            { icon: '🔄', title: 'Auto Conversion', desc: 'When a lead is ready, one click converts them to a customer automatically.' },
            { icon: '📈', title: 'Real-time Reports', desc: 'See which sources bring the best leads and double down on what works.' },
          ].map(f => (
            <div
              key={f.title}
              className="glass-panel"
              style={{ padding: '1.5rem' }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h4 style={{ color: '#f8fafc', marginBottom: '0.4rem', fontSize: '1rem' }}>{f.title}</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default GetStarted;

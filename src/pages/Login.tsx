import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { fetchWithAuth } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP state
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevOtp(null);
    setIsLoading(true);

    try {
      const data = await fetchWithAuth('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setSuccess('Verification code sent successfully!');
      setOtpStep(2);
      setCountdown(60);

      // If SMTP is not configured, the backend sends the OTP in response
      if (data.developmentMode && data.otp) {
        setDevOtp(data.otp);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await fetchWithAuth('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      localStorage.setItem('token', data.access_token || data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await fetchWithAuth('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setSuccess('Account created successfully! You can now sign in.');
        setIsRegistering(false);
        setPassword('');
      } else {
        const data = await fetchWithAuth('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        
        localStorage.setItem('token', data.access_token || data.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const resetOtpFlow = () => {
    setOtpStep(1);
    setOtp('');
    setDevOtp(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.1), transparent 40%)' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Welcome Back
          </h2>
          <p>Sign in to continue to MiniCRM</p>
        </div>

        {/* Signup success banner */}
        {justRegistered && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎉</span> Account created! You can now sign in.
          </div>
        )}

        {/* Custom tabs based on pre-defined CSS in index.css */}
        <div className="tabs-container">
          <button 
            type="button"
            className={`tab-btn ${loginMethod === 'otp' ? 'active' : ''}`}
            onClick={() => {
              setLoginMethod('otp');
              setError('');
              setSuccess('');
            }}
          >
            Email Code
          </button>
          <button 
            type="button"
            className={`tab-btn ${loginMethod === 'password' ? 'active' : ''}`}
            onClick={() => {
              setLoginMethod('password');
              setError('');
              setSuccess('');
            }}
          >
            Password
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {success}
          </div>
        )}

        {/* Development Helper Badge */}
        {devOtp && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
            <strong>💡 Dev Mode Helper:</strong> Your OTP code is <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '1px', fontWeight: 'bold' }}>{devOtp}</code>
          </div>
        )}

        {loginMethod === 'otp' ? (
          /* OTP LOGIN FLOW */
          otpStep === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter 6-Digit Code</label>
                  <span 
                    style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
                    onClick={resetOtpFlow}
                  >
                    Change Email
                  </span>
                </div>
                
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em', fontWeight: 'bold' }}
                  required
                />
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                  Code sent to <strong>{email}</strong>
                </p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={isLoading || otp.length < 6}>
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <div style={{ textAlign: 'center' }}>
                {countdown > 0 ? (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Resend code in {countdown}s
                  </span>
                ) : (
                  <span 
                    style={{ fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
                    onClick={handleSendOtp}
                  >
                    Resend Code
                  </span>
                )}
              </div>
            </form>
          )
        ) : (
          /* PASSWORD LOGIN FLOW */
          <form onSubmit={handleSubmitPassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? (isRegistering ? 'Creating Account...' : 'Signing in...') : (isRegistering ? 'Register' : 'Sign In')}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isRegistering ? (
                <p>Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}>Sign In</span></p>
              ) : (
                <p>Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); }}>Register here</span></p>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Create account link */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            id="goto-signup-link"
            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
          >
            Create one for free →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

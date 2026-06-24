import { useState, useEffect } from 'react'
import { BarChart3, Truck, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft, UserPlus, LogIn, Calendar, Mail, Hash } from 'lucide-react'
import {
  login,
  register,
  getDashboard,
  getToken,
  setToken,
  clearToken,
  type AuthUser,
  type DashboardResponse,
} from './lib/api'
import './App.css'

type AuthMode = 'login' | 'register'

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = getToken()
    if (!token) return
    setDashboardLoading(true)
    getDashboard()
      .then((data) => {
        setUser(data.user)
        setDashboard(data)
      })
      .catch(() => {
        // Token expired or invalid — clear it silently
        clearToken()
      })
      .finally(() => setDashboardLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = authMode === 'login'
        ? await login(email, password)
        : await register(email, password)

      setToken(data.token)
      setUser(data.user)

      // Fetch full dashboard data after auth
      const dash = await getDashboard()
      setDashboard(dash)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    clearToken()
    setUser(null)
    setDashboard(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode)
    setError('')
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  // ── Loading splash while restoring session ──────────────────────────────────
  if (dashboardLoading) {
    return (
      <div className="session-loading">
        <div className="session-loading-inner">
          <div className="logo-icon" style={{ width: 48, height: 48, fontSize: 16, borderRadius: 12 }}>TL</div>
          <p>Restoring session…</p>
        </div>
      </div>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  if (user) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <div className="logo-icon">TL</div>
            <div>
              <span className="logo-title">Trident Leasing</span>
              <span className="logo-subtitle">STAFF PLATFORM</span>
            </div>
          </div>
          <div className="dashboard-user">
            <span>{user.email}</span>
            <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
          </div>
        </header>

        <main className="dashboard-main">
          <h1>{dashboard?.message ?? `Welcome back!`}</h1>

          {/* User info card */}
          <div className="user-info-card">
            <h2 className="user-info-title">Account Information</h2>
            <div className="user-info-grid">
              <div className="user-info-item">
                <span className="user-info-icon"><Hash size={15} /></span>
                <div>
                  <div className="user-info-label">User ID</div>
                  <div className="user-info-value">{user.id}</div>
                </div>
              </div>
              <div className="user-info-item">
                <span className="user-info-icon"><Mail size={15} /></span>
                <div>
                  <div className="user-info-label">Email address</div>
                  <div className="user-info-value">{user.email}</div>
                </div>
              </div>
              <div className="user-info-item">
                <span className="user-info-icon"><Calendar size={15} /></span>
                <div>
                  <div className="user-info-label">Member since</div>
                  <div className="user-info-value">{formatDate(user.created_at)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <BarChart3 size={24} />
              <h3>Executive Dashboard</h3>
              <p>Portfolio KPIs, pipeline health, and revenue at a glance.</p>
            </div>
            <div className="dashboard-card">
              <Truck size={24} />
              <h3>Inventory & Leasing</h3>
              <p>End-to-end trailer inventory, applications, and lease lifecycle.</p>
            </div>
            <div className="dashboard-card">
              <Lock size={24} />
              <h3>Collections & Compliance</h3>
              <p>Payment tracking, insurance verification, and audit-ready records.</p>
            </div>
            <div className="dashboard-card">
              <ShieldCheck size={24} />
              <h3>Enterprise Security</h3>
              <p>Role-based access, audit logs, and encrypted sessions.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Login / Register ────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="brand">
            <div className="brand-icon">TL</div>
            <div className="brand-text">
              <div className="brand-title">Trident Leasing</div>
              <div className="brand-subtitle">STAFF PLATFORM</div>
            </div>
          </div>

          <h1 className="hero-title">Enterprise fleet & leasing operations</h1>
          <p className="hero-desc">
            Manage inventory, underwriting, leases, payments, and collections from one secure command center.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <BarChart3 size={20} className="feature-icon" />
              <div className="feature-title">Executive Dashboard</div>
              <div className="feature-desc">Portfolio KPIs, pipeline health, and revenue at a glance.</div>
            </div>
            <div className="feature-card">
              <Truck size={20} className="feature-icon" />
              <div className="feature-title">Inventory & Leasing</div>
              <div className="feature-desc">End-to-end trailer inventory, applications, and lease lifecycle.</div>
            </div>
            <div className="feature-card">
              <Lock size={20} className="feature-icon" />
              <div className="feature-title">Collections & Compliance</div>
              <div className="feature-desc">Payment tracking, insurance verification, and audit-ready records.</div>
            </div>
            <div className="feature-card">
              <ShieldCheck size={20} className="feature-icon" />
              <div className="feature-title">Enterprise Security</div>
              <div className="feature-desc">Role-based access, audit logs, and encrypted sessions.</div>
            </div>
          </div>

          <div className="security-badges">
            <span><ShieldCheck size={14} /> 256-bit TLS</span>
            <span><Lock size={14} /> RBAC enforced</span>
            <span><BarChart3 size={14} /> Audit logged</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-header">
          <button className="back-link">
            <ArrowLeft size={16} />
            Public site
          </button>
          <button className="theme-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>
        </div>

        <div className="login-form-container">
          {/* Auth mode tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authMode === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('login')}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              className={`auth-tab ${authMode === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('register')}
            >
              <UserPlus size={15} />
              Register
            </button>
          </div>

          <h2 className="form-title">
            {authMode === 'login' ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p className="form-subtitle">
            {authMode === 'login'
              ? 'Enter your staff credentials to access the admin platform.'
              : 'Register a new staff account to get started.'}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tridentleasing.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={authMode === 'register' ? 8 : undefined}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {authMode === 'register' && (
                <span className="field-hint">Minimum 8 characters</span>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading
                ? authMode === 'login' ? 'Signing in…' : 'Creating account…'
                : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {authMode === 'login' ? (
              <>Don't have an account?{' '}
                <button className="auth-switch-btn" onClick={() => switchMode('register')}>Register</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button className="auth-switch-btn" onClick={() => switchMode('login')}>Sign in</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

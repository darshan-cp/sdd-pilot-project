import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { BarChart3, Truck, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import './App.css'

interface User {
  id: string
  email: string
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setEmail('')
    setPassword('')
  }

  const fillDemoAccount = (role: string) => {
    setEmail(`${role.toLowerCase()}@tridentleasing.com`)
    setPassword('password123')
    setError('')
  }

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
          <h1>Welcome to Trident Leasing</h1>
          <p>You are signed in as <strong>{user.email}</strong></p>
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
          <h2 className="form-title">Sign in to your account</h2>
          <p className="form-subtitle">Enter your staff credentials to access the admin platform.</p>

          <form onSubmit={handleSignIn} className="login-form">
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
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-accounts">
            <div className="demo-label">Demo accounts</div>
            <div className="demo-buttons">
              <button onClick={() => fillDemoAccount('Admin')} className="demo-btn">
                Admin
              </button>
              <button onClick={() => fillDemoAccount('Manager')} className="demo-btn">
                Manager
              </button>
              <button onClick={() => fillDemoAccount('Underwriter')} className="demo-btn">
                Underwriter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

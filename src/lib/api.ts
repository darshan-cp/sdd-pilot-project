const BASE = '/api'

export interface AuthUser {
  id: number
  email: string
  created_at: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface DashboardResponse {
  user: AuthUser
  message: string
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem('jwt_token')
}

export function setToken(token: string): void {
  localStorage.setItem('jwt_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('jwt_token')
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Registration failed')
  return data as AuthResponse
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Login failed')
  return data as AuthResponse
}

// ── Protected API ─────────────────────────────────────────────────────────────

export async function getDashboard(): Promise<DashboardResponse> {
  const token = getToken()
  const res = await fetch(`${BASE}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to load dashboard')
  return data as DashboardResponse
}

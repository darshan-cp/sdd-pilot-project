import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', authRoutes)
app.use('/api', dashboardRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Boot ──────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await initDb()
    app.listen(PORT, () => {
      console.log(`✓ API server listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()

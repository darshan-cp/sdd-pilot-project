import { Router } from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/dashboard  — requires a valid JWT
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      message: `Welcome back, ${user.email}!`,
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

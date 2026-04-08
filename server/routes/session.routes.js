const router = require('express').Router()
const auth   = require('../middleware/auth.middleware')
const {
  createSession,
  getSession,
  getUserSessions,
  submitAnswer,
  completeSession,
  getSessionStats
} = require('../controllers/session.controller')

router.post('/create',       auth, createSession)
router.get('/',              auth, getUserSessions)
router.get('/stats',         auth, getSessionStats)   // ← new
router.get('/:id',           auth, getSession)
router.post('/:id/answer',   auth, submitAnswer)
router.post('/:id/complete', auth, completeSession)

module.exports = router
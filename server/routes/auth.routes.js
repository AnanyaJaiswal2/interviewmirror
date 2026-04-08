const router = require('express').Router()
const { signup, login } = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/signup', signup)
router.post('/login', login)

// Protected test route — only works with a valid token
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
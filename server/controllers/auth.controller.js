const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Helper — creates a signed JWT for a given user
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // 2. Hash the password — saltRounds=10 is the industry standard
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Save user to MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // 4. Generate JWT and send back
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
      // Never send password back — not even the hash
    })

  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
      // Don't say "email not found" — that tells attackers which emails exist
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // 3. Generate JWT and send back
    const token = generateToken(user)

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })

  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}
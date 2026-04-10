const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
require('dotenv').config()

const app = express()

// CORS — allows any localhost in dev, specific URL in production
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)

    if (origin.startsWith('http://localhost')) {
      return callback(null, true)
    }

    const allowedOrigins = [
      'https://interviewmirror.vercel.app/',  // ← your actual Vercel URL
      process.env.FRONTEND_URL
    ].filter(Boolean)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth',     require('./routes/auth.routes'))
app.use('/api/sessions', require('./routes/session.routes'))

// Health check — Railway uses this to verify the app is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => console.error('MongoDB error:', err))
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  // Authorization header looks like: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]  // grab the part after "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token.' })
  }

  try {
    // jwt.verify checks the signature AND expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // { userId, email, name } — available in all routes
    next()              // move on to the actual route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
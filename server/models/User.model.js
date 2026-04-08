const mongoose = require('mongoose')

// A Schema is a blueprint — it defines what a User document looks like
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true               // removes accidental spaces
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,            // no two users can share an email
    lowercase: true,         // always store as lowercase
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// mongoose.model('User', userSchema) creates a collection called "users"
module.exports = mongoose.model('User', userSchema)
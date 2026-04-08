// const mongoose = require('mongoose')

// const sessionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',       // links to the User collection
//     required: true
//   },
//   jobRole: {
//     type: String,
//     required: true,
//     default: 'Software Engineer'
//   },
//   difficulty: {
//     type: String,
//     enum: ['easy', 'medium', 'hard'],
//     default: 'medium'
//   },
//   status: {
//     type: String,
//     enum: ['in_progress', 'completed'],
//     default: 'in_progress'
//   },
//   questions: [
//     {
//       id: Number,
//       text: String,
//       type: String,          // 'behavioral' | 'technical'
//       answer: {
//         transcript: String,  // what the user said
//         duration: Number,    // seconds taken
//         scores: {
//           relevance:  { score: Number, feedback: String },
//           structure:  { score: Number, feedback: String },
//           depth:      { score: Number, feedback: String },
//           confidence: { score: Number, feedback: String }
//         },
//         behavior: {
//           eye_contact_pct:   Number,
//           hesitation_count:  Number,
//           speaking_pace_wpm: Number
//         }
//       }
//     }
//   ],
//   summary: {
//     overall_score:      Number,
//     confidence_score:   Number,
//     communication_score: Number,
//     content_score:      Number,
//     improvement_areas:  [String],
//     strong_areas:       [String]
//   },
//   createdAt: { type: Date, default: Date.now },
//   completedAt: Date
// })

// module.exports = mongoose.model('Session', sessionSchema)


const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true,
    default: 'Software Engineer'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  questions: [
    {
      id: { type: Number },
      text: { type: String },
      type: { type: String },
      difficulty: { type: String },
      answer: {
        transcript: { type: String },
        duration: { type: Number },
        scores: {
          relevance:  { score: Number, feedback: String },
          structure:  { score: Number, feedback: String },
          depth:      { score: Number, feedback: String },
          confidence: { score: Number, feedback: String }
        },
        behavior: {
          eye_contact_pct:   { type: Number },
          hesitation_count:  { type: Number },
          speaking_pace_wpm: { type: Number }
        },
        overall_tip: { type: String }
      }
    }
  ],
  summary: {
    overall_score:       { type: Number },
    confidence_score:    { type: Number },
    communication_score: { type: Number },
    content_score:       { type: Number },
    improvement_areas:   [String],
    strong_areas:        [String]
  },
  createdAt:   { type: Date, default: Date.now },
  completedAt: { type: Date }
})

module.exports = mongoose.model('Session', sessionSchema)
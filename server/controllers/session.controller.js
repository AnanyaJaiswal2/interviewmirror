const Session = require('../models/Session.model')
const { generateQuestions, evaluateAnswer, getNextDifficulty } = require('../services/ai.service')
const { computeConfidence, computeAnswerScore, computeSessionSummary, getBand } = require('../services/score.service')

// ─────────────────────────────────────────
// POST /api/sessions/create
// Creates a new session with AI questions
// ─────────────────────────────────────────
exports.createSession = async (req, res) => {
  try {
    const { jobRole, difficulty } = req.body
    console.log(`Generating questions for ${jobRole} (${difficulty || 'medium'})...`)

    const questions = await generateQuestions(jobRole, difficulty || 'medium', 10)

    const session = await Session.create({
      userId:     req.user.userId,
      jobRole:    jobRole || 'Software Engineer',
      difficulty: difficulty || 'medium',
      status:     'in_progress',
      questions:  questions.map(q => ({
        id:     q.id,
        text:   q.text,
        type:   q.type,
        answer: null
      }))
    })

    res.status(201).json({
      sessionId: session._id,
      questions: session.questions,
      message:   'Session created successfully'
    })

  } catch (err) {
    console.error('Create session error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────
// POST /api/sessions/:id/answer
// Evaluates one answer and saves scores
// ─────────────────────────────────────────
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, transcript, duration, behavior } = req.body

    const session = await Session.findOne({
      _id:    req.params.id,
      userId: req.user.userId
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    const question = session.questions.find(q => q.id === questionId)
    if (!question) {
      return res.status(404).json({ error: 'Question not found' })
    }

    // 1. Get AI evaluation of the answer
    const aiScores = await evaluateAnswer(
      question.text,
      transcript,
      session.jobRole
    )

    // 2. Compute confidence from behavioral signals
    const confidenceScore = computeConfidence(behavior)

    // 3. Compute weighted answer score (0-100)
    const answerScore = computeAnswerScore(aiScores, confidenceScore)

    // 4. Build complete scores object
    const scores = {
      relevance: {
        score:    aiScores.relevance.score,
        feedback: aiScores.relevance.feedback
      },
      structure: {
        score:    aiScores.structure.score,
        feedback: aiScores.structure.feedback
      },
      depth: {
        score:    aiScores.depth.score,
        feedback: aiScores.depth.feedback
      },
      confidence: {
        score:    confidenceScore,
        feedback: getConfidenceFeedback(confidenceScore)
      }
    }

    // 5. Save everything to the question answer object
    question.answer = {
      transcript,
      duration:    duration || 0,
      scores,
      behavior:    behavior || {},
      overall_tip: aiScores.overall_tip
    }

    // 6. Adapt difficulty for next question
    const avgAIScore = (
      aiScores.relevance.score +
      aiScores.structure.score +
      aiScores.depth.score
    ) / 3

    session.difficulty = getNextDifficulty(session.difficulty, avgAIScore)
    session.markModified('questions')
    await session.save()

    res.json({
      scores,
      overall_tip:     aiScores.overall_tip,
      answer_score:    answerScore,
      next_difficulty: session.difficulty,
      avg_score:       Math.round(avgAIScore * 10) / 10
    })

  } catch (err) {
    console.error('Submit answer error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────
// POST /api/sessions/:id/complete
// Computes session summary when user ends
// ─────────────────────────────────────────
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id:    req.params.id,
      userId: req.user.userId
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    // Compute full summary from all answered questions
    const summary = computeSessionSummary(session.questions)
    const band    = getBand(summary.overall_score)

    // Save to MongoDB
    session.status      = 'completed'
    session.completedAt = new Date()
    session.summary     = summary

    await session.save()

    // Calculate total duration in seconds
    const durationSeconds = Math.round(
      (session.completedAt - session.createdAt) / 1000
    )

    res.json({
      summary,
      band,
      duration: durationSeconds
    })

  } catch (err) {
    console.error('Complete session error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────
// GET /api/sessions/:id
// Fetches a single session by ID
// ─────────────────────────────────────────
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id:    req.params.id,
      userId: req.user.userId
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(session)

  } catch (err) {
    console.error('Get session error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────
// GET /api/sessions
// Gets all sessions for logged-in user
// ─────────────────────────────────────────
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('jobRole difficulty status summary questions createdAt completedAt')

    res.json(sessions)

  } catch (err) {
    console.error('Get sessions error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────
// GET /api/sessions/stats
// Returns aggregate analytics for dashboard
// ─────────────────────────────────────────
exports.getSessionStats = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user.userId,
      status: 'completed'
    }).sort({ createdAt: 1 })

    if (sessions.length === 0) {
      return res.json({
        totalSessions:  0,
        averageScore:   0,
        bestScore:      0,
        latestScore:    0,
        improvement:    0,
        chartData:      [],
        roleBreakdown:  []
      })
    }

    // Extract all overall scores
    const scores = sessions.map(s => s.summary?.overall_score || 0)

    const totalSessions = sessions.length
    const averageScore  = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    )
    const bestScore   = Math.max(...scores)
    const latestScore = scores[scores.length - 1]

    // Improvement = difference between first and last completed session
    const improvement = scores.length > 1
      ? latestScore - scores[0]
      : 0

    // Chart data — one point per completed session
    const chartData = sessions.map((s, i) => ({
      session:    i + 1,
      score:      s.summary?.overall_score       || 0,
      confidence: s.summary?.confidence_score    || 0,
      content:    s.summary?.content_score       || 0,
      date:       s.createdAt,
      jobRole:    s.jobRole
    }))

    // Breakdown by job role
    const roleMap = {}
    sessions.forEach(s => {
      const role = s.jobRole || 'Other'
      if (!roleMap[role]) {
        roleMap[role] = { count: 0, totalScore: 0 }
      }
      roleMap[role].count++
      roleMap[role].totalScore += s.summary?.overall_score || 0
    })

    const roleBreakdown = Object.entries(roleMap).map(([role, data]) => ({
      role,
      count:        data.count,
      averageScore: Math.round(data.totalScore / data.count)
    }))

    res.json({
      totalSessions,
      averageScore,
      bestScore,
      latestScore,
      improvement,
      chartData,
      roleBreakdown
    })

  } catch (err) {
    console.error('Get stats error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────
function getConfidenceFeedback(score) {
  if (score >= 8) return 'Strong confident delivery throughout'
  if (score >= 6) return 'Good delivery with minor hesitations'
  if (score >= 4) return 'Some nervousness detected — practice pacing'
  return 'Work on eye contact and reducing filler words'
}
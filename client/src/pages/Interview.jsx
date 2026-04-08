import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebcam } from '../hooks/useWebcam'
import { useTimer } from '../hooks/useTimer'
import { useSpeech } from '../hooks/useSpeech'
import { useFaceAnalysis } from '../hooks/useFaceAnalysis'
import { sessionService } from '../services/api'
import WaveformVisualizer from '../components/WaveformVisualizer'
import FillerWordBadge from '../components/FillerWordBadge'
import EyeContactIndicator from '../components/EyeContactIndicator'
import BehaviorPanel from '../components/BehaviorPanel'
import ConfidenceMeter from '../components/ConfidenceMeter'
import ScoreBreakdown from '../components/ScoreBreakdown'
import SessionComplete from '../components/SessionComplete'
import { estimateLiveConfidence } from '../utils/scoreUtils'

export default function Interview() {
  const { id } = useParams()
  const navigate = useNavigate()

  // ── Hooks ──
  const { videoRef, hasPermission } = useWebcam()
  const timer  = useTimer()
  const speech = useSpeech()
  const face   = useFaceAnalysis(videoRef)

  // ── Session State ──
  const [questions, setQuestions]         = useState([])
  const [currentQ, setCurrentQ]           = useState(0)
  const [isRecording, setIsRecording]     = useState(false)
  const [sessionEnded, setSessionEnded]   = useState(false)
  const [loading, setLoading]             = useState(true)
  const [lastScores, setLastScores]       = useState(null)
  const [answerScore, setAnswerScore]     = useState(null)
  const [isEvaluating, setIsEvaluating]   = useState(false)
  const [coachingTip, setCoachingTip]     = useState(
    'Use the STAR method — Situation, Task, Action, Result'
  )

  // ── Scoring State ──
  const [liveConfidence, setLiveConfidence] = useState(7)
  const [sessionSummary, setSessionSummary] = useState(null)
  const [sessionBand, setSessionBand]       = useState(null)

  // ── On Mount ──
  useEffect(() => {
    loadSession()
    timer.start()
  }, [])

  // ── Live Confidence Meter — updates every second while recording ──
  useEffect(() => {
    if (!isRecording) return
    const interval = setInterval(() => {
      const estimated = estimateLiveConfidence(
        face.eyeContact,
        speech.fillerCount,
        speech.wordCount
      )
      setLiveConfidence(estimated)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRecording, face.eyeContact, speech.fillerCount, speech.wordCount])

  // ── Load Session ──
 const loadSession = async () => {
  try {
    const res = await sessionService.getOne(id)
    setQuestions(res.data.questions)
    // Start with only question 1 visible
    setCurrentQ(0)
    setLoading(false)
  } catch (err) {
    console.error('Failed to load session:', err)
    navigate('/dashboard')
  }
}

  // ── Start Recording ──
  const handleStartRecording = () => {
    setIsRecording(true)
    setLastScores(null)
    setAnswerScore(null)
    setCoachingTip('Speak clearly and maintain eye contact with the camera.')
    speech.startListening()
    face.startAnalysis()
  }

  // ── Stop Recording + Evaluate ──
  const handleStopRecording = async () => {
    setIsRecording(false)

    const speechData = speech.stopListening()
    const faceData   = face.stopAnalysis()

    if (!speechData.fullTranscript.trim()) {
      setCoachingTip('No answer detected. Try speaking closer to your microphone.')
      return
    }

    setIsEvaluating(true)
    setCoachingTip('Evaluating your answer with AI...')

    try {
      const question = questions[currentQ]

      const res = await sessionService.submitAnswer(id, {
        questionId: question.id,
        transcript: speechData.fullTranscript,
        duration:   timer.seconds,
        behavior: {
          eye_contact_pct:     faceData?.eye_contact_pct     || 70,
          hesitation_count:    speechData.fillerCount,
          speaking_pace_wpm:   speechData.wordsPerMinute,
          nervousness_score:   faceData?.nervousness_score    || 0,
          dominant_expression: faceData?.dominant_expression  || 'neutral',
        }
      })

      setLastScores(res.data.scores)
      setAnswerScore(res.data.answer_score)
      setCoachingTip(res.data.overall_tip)
      setIsEvaluating(false)

// In handleStopRecording, after getting scores:
// Show scores for 4 seconds then auto-advance
setTimeout(() => {
  if (currentQ < questions.length - 1) {
    setCurrentQ(q => q + 1)
    setLastScores(null)
    setAnswerScore(null)
    setCoachingTip('Use the STAR method — Situation, Task, Action, Result')
  } else {
    // All 10 questions answered — end session
    handleEndSession()
  }
}, 4000)

    } catch (err) {
      console.error('Evaluation error:', err)
      setIsEvaluating(false)
      setCoachingTip('Evaluation failed. Moving to next question.')
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ(q => q + 1)
        } else handleEndSession()
      }, 2000)
    }
  }

  // ── End Session ──
  const handleEndSession = async () => {
    timer.pause()
    speech.stopListening()
    face.stopAnalysis()
    setSessionEnded(true)

    try {
      const res = await sessionService.complete(id)
      setSessionSummary(res.data.summary)
      setSessionBand(res.data.band)
    } catch (err) {
      console.error('Complete session error:', err)
    }
  }

  // ── Skip Question ──
  const handleSkip = () => {
    speech.stopListening()
    face.stopAnalysis()
    setIsRecording(false)
    setLastScores(null)
    setAnswerScore(null)
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
      setCoachingTip('Use the STAR method — Situation, Task, Action, Result')
    } else {
      handleEndSession()
    }
  }

  // ────────────────────────────────────────
  // RENDER STATES
  // ────────────────────────────────────────

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent
                          rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-400 text-sm">
            Generating your questions with AI...
          </p>
        </div>
      </div>
    )
  }

  // Camera denied
  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-semibold mb-2">
            Camera access needed
          </p>
          <p className="text-gray-400 text-sm mb-6">
            InterviewMirror needs your camera and microphone
            for behavioral analysis.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Computing results
  if (sessionEnded && !sessionSummary) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent
                          rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-400 text-sm">Computing your results...</p>
        </div>
      </div>
    )
  }

  // Session complete screen
  if (sessionEnded && sessionSummary) {
    return <SessionComplete summary={sessionSummary} band={sessionBand} />
  }

  const question = questions[currentQ]

  // ────────────────────────────────────────
  // MAIN INTERVIEW ROOM
  // ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-6 py-4
                      border-b border-white/10">
        <div className="flex items-center gap-3">

          {/* Logo */}
          <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center
                          justify-center text-xs font-bold text-white">
            IM
          </div>
          <span className="text-white font-medium text-sm">
            InterviewMirror
          </span>

          {/* Recording indicator */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-red-500/20 border
                         border-red-500/30 text-red-400 text-xs
                         px-3 py-1 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400
                               animate-pulse"/>
              Recording
            </motion.div>
          )}

          {/* Face model loading */}
          {!face.isLoaded && (
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <div className="w-3 h-3 border border-gray-500
                              border-t-transparent rounded-full animate-spin"/>
              Loading face detection...
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="font-mono text-sm text-gray-400 bg-white/5
                          px-3 py-1 rounded-lg">
            {timer.formatted()}
          </div>

{/* Shows answered count out of total */}
<div className="text-sm text-gray-500">
  Q {currentQ + 1} / {questions.length}
</div>

          {/* End session */}
          <button
            onClick={handleEndSession}
            className="text-xs text-red-400 border border-red-500/30
                       px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
          >
            End Session
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Panel ── */}
        <div className="flex-1 p-6 flex flex-col gap-4">

          {/* Webcam */}
          <div
            className="relative bg-gray-900 rounded-2xl overflow-hidden
                        border border-white/10"
            style={{ aspectRatio: '4/3' }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Name label */}
            <div className="absolute bottom-3 left-3 text-xs text-white/60
                            bg-black/50 px-2 py-1 rounded-md">
              You
            </div>

            {/* Word count while recording */}
            {isRecording && speech.wordCount > 0 && (
              <div className="absolute bottom-3 right-3 text-xs
                              text-white/50 bg-black/50 px-2 py-1 rounded-md">
                {speech.wordCount} words
              </div>
            )}

            {/* Eye contact indicator */}
            <EyeContactIndicator
              eyeContact={face.eyeContact}
              faceDetected={face.faceDetected}
              expression={face.expression}
            />
          </div>

          {/* Waveform */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <WaveformVisualizer isActive={isRecording} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={isRecording
                ? handleStopRecording
                : handleStartRecording}
              disabled={isEvaluating}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm
                transition disabled:opacity-50
                ${isRecording
                  ? 'bg-red-500 hover:bg-red-400 text-white'
                  : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
            >
              {isEvaluating
                ? 'Evaluating...'
                : isRecording
                  ? 'Stop Answering'
                  : 'Start Answering'}
            </button>

            <button
              onClick={handleSkip}
              disabled={isEvaluating}
              className="px-5 py-3 rounded-xl text-sm text-gray-400
                         disabled:opacity-50 border border-white/10
                         hover:border-white/20 transition"
            >
              Skip
            </button>
          </div>

          {/* Filler Word Badge */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FillerWordBadge
                  fillerCount={speech.fillerCount}
                  detectedFillers={speech.detectedFillers}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-72 border-l border-white/10 p-5 flex
                        flex-col gap-4 overflow-y-auto">

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-violet-600/10 border border-violet-500/20
                         rounded-xl p-4"
            >
              <div className="text-xs font-medium text-violet-400
                              mb-2 tracking-wider">
                QUESTION {currentQ + 1}
              </div>
              <p className="text-white/85 text-sm leading-relaxed">
                {question?.text}
              </p>
              <span className="mt-2 inline-block text-xs text-violet-500/70
                               bg-violet-500/10 px-2 py-0.5 rounded-full">
                {question?.type}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Live Coaching Tip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={coachingTip}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20
                         rounded-xl p-3"
            >
              <div className="text-xs font-medium text-emerald-400
                              mb-1 tracking-wider">
                {isEvaluating ? 'EVALUATING...' : 'LIVE COACHING'}
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                {coachingTip}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Live Confidence Meter */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConfidenceMeter score={liveConfidence} isLive={true} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Behavior Panel */}
          <BehaviorPanel
            eyeContact={face.eyeContact}
            expression={face.expression}
            nervousness={face.nervousness}
            faceDetected={face.faceDetected}
          />

          {/* Live Speech Stats */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-2"
              >
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">
                    {speech.wordCount}
                  </div>
                  <div className="text-xs text-white/40">words</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className={`text-lg font-bold
                    ${speech.fillerCount === 0 ? 'text-emerald-400'
                    : speech.fillerCount <= 3  ? 'text-yellow-400'
                    : 'text-red-400'}`}
                  >
                    {speech.fillerCount}
                  </div>
                  <div className="text-xs text-white/40">fillers</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Score Breakdown after answering */}
          <AnimatePresence>
            {lastScores && (
              <ScoreBreakdown
                scores={lastScores}
                answerScore={answerScore}
                tip={coachingTip}
              />
            )}
          </AnimatePresence>

          {/* Live Transcript */}
          <div className="flex-1 bg-white/5 rounded-xl p-3
                          border border-white/5 min-h-24">
            <div className="text-xs font-medium text-white/30
                            mb-2 tracking-wider">
              LIVE TRANSCRIPT
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              {speech.fullDisplay || (
                <span className="italic text-white/30">
                  {isRecording
                    ? 'Listening...'
                    : 'Your answer appears here as you speak.'}
                </span>
              )}
              {isRecording && (
                <span className="inline-block w-0.5 h-3 bg-violet-400
                                 animate-pulse ml-0.5 align-middle"/>
              )}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Sign up in seconds. No credit card needed. Your interview history and scores are saved securely to your personal dashboard.',
    color: 'violet',
    details: [
      'Secure JWT authentication',
      'Password encrypted with bcrypt',
      'Session persists across browser refreshes',
    ],
  },
  {
    number: '02',
    title: 'Choose your role and difficulty',
    description:
      'Select the job role you are interviewing for and set the difficulty. Our AI generates 5 role-specific questions tailored to your level.',
    color: 'blue',
    details: [
      'Software Engineer, Frontend, Backend, Full Stack, PM, Data Scientist',
      'Easy, Medium, Hard difficulty levels',
      'Questions adapt mid-session based on your performance',
    ],
  },
  {
    number: '03',
    title: 'Enter the AI interview room',
    description:
      'The interview room looks and feels like a real video interview. Your webcam is active, a timer runs, and questions appear one by one.',
    color: 'teal',
    details: [
      'Live webcam feed with behavioral tracking',
      'Session timer and question counter',
      'Real-time recording indicator',
    ],
  },
  {
    number: '04',
    title: 'Speak your answer — we listen and watch',
    description:
      'Click Start Answering and speak naturally. Your words appear on screen in real time. Meanwhile our AI watches your face and listens for confidence signals.',
    color: 'emerald',
    details: [
      'Web Speech API converts voice to text live',
      'Filler word detection — um, uh, like, basically',
      'Speaking pace tracked in words per minute',
      'face-api.js tracks eye contact and expression every 200ms',
    ],
  },
  {
    number: '05',
    title: 'Get instant AI feedback on every answer',
    description:
      'After each answer, GPT-4o evaluates your response across four dimensions and gives specific, actionable feedback — not just a number.',
    color: 'amber',
    details: [
      'Relevance — did you answer the actual question?',
      'Structure — did you use STAR method?',
      'Depth — did you give examples and detail?',
      'Confidence — eye contact, pace, filler words combined',
    ],
  },
  {
    number: '06',
    title: 'Review your complete session report',
    description:
      'After all questions, see your overall score, performance band, strongest areas, and what to improve. Every answer is saved for full replay.',
    color: 'coral',
    details: [
      'Overall weighted score out of 100',
      'Performance band — Strong Hire, Hire, Consider, Needs Work',
      'Per-answer transcript, scores and coaching tips',
      'Progress charts across all your sessions',
    ],
  },
]

const features = [
  {
    title: 'Real-time coaching',
    description:
      'Live tips appear as you speak — not after. "Use STAR method", "Maintain eye contact", "Slow down your pace."',
    color: 'violet',
  },
  {
    title: 'Behavioral analysis',
    description:
      'face-api.js runs 5 times per second analyzing your eye contact, facial expression, and composure — all in the browser, never sent to a server.',
    color: 'emerald',
  },
  {
    title: 'Adaptive difficulty',
    description:
      'Score above 8/10 on an answer? Next question gets harder. Below 4/10? It gets easier. The interview calibrates to your level automatically.',
    color: 'amber',
  },
  {
    title: 'Explainable scores',
    description:
      'Every score has a reason. Not just "7/10" — but "Your answer was relevant but lacked a concrete outcome in the Result stage."',
    color: 'blue',
  },
  {
    title: 'Interview replay',
    description:
      'Every session is saved. Go back to any interview, read your transcript, see your scores, and track exactly how you have improved.',
    color: 'teal',
  },
  {
    title: 'Privacy first',
    description:
      'Face detection runs entirely in your browser using TensorFlow.js. Your webcam frames are never uploaded to any server.',
    color: 'coral',
  },
]

const colorMap = {
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400',  num: 'bg-violet-600'  },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    num: 'bg-blue-600'    },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    text: 'text-teal-400',    num: 'bg-teal-600'    },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', num: 'bg-emerald-600' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   num: 'bg-amber-600'   },
  coral:   { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  num: 'bg-orange-600'  },
}

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-8 py-5
                      border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center
                          justify-center text-sm font-bold">
            IM
          </div>
          <span className="font-semibold text-lg">InterviewMirror</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="bg-violet-600 hover:bg-violet-500 transition
                       px-5 py-2 rounded-lg text-sm font-medium"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="text-center px-4 py-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                          bg-violet-600/20 border border-violet-500/30
                          text-violet-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400
                             animate-pulse"/>
            How InterviewMirror works
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            From signup to
            <span className="text-violet-400"> confident interview</span>
            <br />in 6 steps
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            InterviewMirror is not just another chatbot interview tool.
            It watches you, listens to you, and coaches you in real time
            — exactly like a senior interviewer would.
          </p>
        </motion.div>
      </section>

      {/* ── Steps ── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="relative">

          {/* Vertical line connecting steps */}
          <div className="absolute left-8 top-0 bottom-0 w-px
                          bg-white/10 hidden md:block"/>

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => {
              const c = colorMap[step.color]
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 md:gap-8"
                >
                  {/* Step number circle */}
                  <div className="flex-shrink-0 relative">
                    <div className={`w-16 h-16 rounded-2xl ${c.num}
                                    flex items-center justify-center
                                    text-white font-bold text-lg z-10
                                    relative`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className={`flex-1 ${c.bg} border ${c.border}
                                   rounded-2xl p-6`}>
                    <h3 className={`text-xl font-bold mb-2 ${c.text}`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {step.details.map(d => (
                        <li key={d}
                          className="flex items-start gap-2 text-xs
                                     text-gray-400">
                          <span className={`${c.text} mt-0.5 flex-shrink-0`}>
                            ✓
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── What Makes It Different ── */}
      <section className="bg-gray-900/50 border-y border-white/10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              What makes InterviewMirror different
            </h2>
            <p className="text-gray-400">
              Most tools give feedback after it is too late to change anything.
              We coach you while you are still speaking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const c = colorMap[f.color]
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`${c.bg} border ${c.border} rounded-xl p-5`}
                >
                  <h4 className={`font-semibold mb-2 ${c.text}`}>
                    {f.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">
            InterviewMirror vs other tools
          </h2>
          <p className="text-gray-400">
            See exactly how we compare to existing interview prep platforms.
          </p>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-2xl
                        overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 gap-0 border-b border-white/10">
            <div className="p-4 text-sm text-gray-500 font-medium">
              Feature
            </div>
            <div className="p-4 text-center text-sm font-semibold
                            text-violet-400 bg-violet-600/10 border-x
                            border-violet-500/20">
              InterviewMirror
            </div>
            <div className="p-4 text-center text-sm text-gray-400">
              HireVue
            </div>
            <div className="p-4 text-center text-sm text-gray-400">
              Pramp
            </div>
          </div>

          {/* Rows */}
          {[
            {
              feature:      'Real-time coaching during interview',
              us:           '✓',
              hirevue:      '✗',
              pramp:        '✗',
            },
            {
              feature:      'Adaptive difficulty per answer',
              us:           '✓',
              hirevue:      '✗',
              pramp:        '✗',
            },
            {
              feature:      'Behavioral analysis (face + voice)',
              us:           '✓',
              hirevue:      'Partial',
              pramp:        '✗',
            },
            {
              feature:      'Explainable score breakdown',
              us:           '✓',
              hirevue:      '✗',
              pramp:        '✗',
            },
            {
              feature:      'Session replay with transcript',
              us:           '✓',
              hirevue:      'Partial',
              pramp:        '✗',
            },
            {
              feature:      'Free to use',
              us:           '✓',
              hirevue:      '✗',
              pramp:        '✓',
            },
            {
              feature:      'Privacy — no face data uploaded',
              us:           '✓',
              hirevue:      '✗',
              pramp:        '✓',
            },
          ].map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 border-b border-white/5
                          ${i % 2 === 0 ? '' : 'bg-white/5'}`}
            >
              <div className="p-4 text-sm text-gray-300">
                {row.feature}
              </div>
              <div className="p-4 text-center text-sm font-medium
                              text-emerald-400 bg-violet-600/5
                              border-x border-violet-500/10">
                {row.us}
              </div>
              <div className={`p-4 text-center text-sm
                              ${row.hirevue === '✓'
                                ? 'text-emerald-400'
                                : row.hirevue === '✗'
                                  ? 'text-red-400'
                                  : 'text-yellow-400'}`}>
                {row.hirevue}
              </div>
              <div className={`p-4 text-center text-sm
                              ${row.pramp === '✓'
                                ? 'text-emerald-400'
                                : row.pramp === '✗'
                                  ? 'text-red-400'
                                  : 'text-yellow-400'}`}>
                {row.pramp}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="bg-gray-900/50 border-t border-white/10
                           py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Built with modern tech</h2>
          <p className="text-gray-400 text-sm mb-8">
            Every technology was chosen for a specific reason.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'React',          reason: 'Frontend UI'              },
              { name: 'Node.js',        reason: 'Backend API'              },
              { name: 'MongoDB',        reason: 'Session storage'          },
              { name: 'OpenAI GPT-4o',  reason: 'Question generation'     },
              { name: 'Web Speech API', reason: 'Real-time transcription'  },
              { name: 'face-api.js',    reason: 'Behavioral analysis'      },
              { name: 'JWT',            reason: 'Authentication'           },
              { name: 'Tailwind CSS',   reason: 'Styling'                  },
              { name: 'framer-motion',  reason: 'Animations'               },
              { name: 'Recharts',       reason: 'Analytics charts'         },
            ].map(t => (
              <div key={t.name}
                className="bg-gray-900 border border-white/10 rounded-lg
                           px-4 py-2 text-center">
                <div className="text-sm font-medium text-white">
                  {t.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {t.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to practice smarter?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of candidates who practice with real-time
            AI coaching instead of hoping for the best.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-violet-600 hover:bg-violet-500 transition
                         px-8 py-3 rounded-xl font-semibold"
            >
              Start Free Practice
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-white/20 hover:border-white/40
                         transition px-8 py-3 rounded-xl text-gray-300"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
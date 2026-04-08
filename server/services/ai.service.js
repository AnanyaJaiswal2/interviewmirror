// ─────────────────────────────────────────────────────
// MOCK AI SERVICE
// Replace with real OpenAI version when API key ready
// ─────────────────────────────────────────────────────

// High value question templates by category
// These are the most commonly asked questions in real tech interviews
const BEHAVIORAL_QUESTIONS = [
  "Tell me about a time you faced a major technical challenge. How did you approach and resolve it?",
  "Describe a situation where you had to learn a completely new technology in a short time. What was your process?",
  "Tell me about a time you disagreed with a teammate or manager on a technical decision. How did you handle it?",
  "Describe a project where you had to balance quality with a tight deadline. What tradeoffs did you make?",
  "Tell me about your most impactful project. What was your specific contribution and what was the outcome?",
  "Describe a time you received critical feedback on your work. How did you respond and what did you change?",
  "Tell me about a time you had to debug a production issue under pressure. Walk me through your thinking.",
  "Describe a situation where requirements changed midway through a project. How did you adapt?",
  "Tell me about a time you mentored someone or helped a teammate grow technically.",
  "Describe a project that failed or did not go as planned. What did you learn from it?",
  "Tell me about a time you had to make a decision with incomplete information. What was the outcome?",
  "Describe a situation where you improved a process or system that was already working.",
]

const ROLE_QUESTIONS = {
  // ── Frontend ──
  'frontend': [
    "Explain the difference between CSS Flexbox and Grid. When would you choose one over the other?",
    "What is the virtual DOM in React and why does it improve performance?",
    "Explain React hooks. What problem do useState and useEffect solve compared to class components?",
    "What is code splitting and lazy loading? How have you used them to improve performance?",
    "Explain the concept of accessibility in web development. How do you ensure your UI is accessible?",
    "What are Web Vitals and how do you measure and optimize them?",
    "Explain the difference between controlled and uncontrolled components in React.",
    "What is Cross-Site Scripting (XSS) and how do you prevent it in a frontend application?",
    "How does the browser render a webpage from HTML to pixels? Walk me through the critical rendering path.",
    "What is memoization in React? When would you use useMemo and useCallback?",
    "Explain the event loop in JavaScript. How does it handle asynchronous operations?",
    "What is TypeScript and what advantages does it offer over plain JavaScript?",
  ],

  // ── Backend ──
  'backend': [
    "Explain RESTful API design principles. What makes an API truly RESTful?",
    "What is the difference between SQL and NoSQL databases? When would you choose each?",
    "How do you handle authentication and authorization in a backend system?",
    "Explain database indexing. How does it work and when would you add or avoid an index?",
    "What is the N+1 query problem and how do you solve it?",
    "How do you design a system to handle 100x more traffic than expected?",
    "Explain the difference between synchronous and asynchronous processing. When would you use a message queue?",
    "What is caching? Explain different caching strategies and when to use each.",
    "How do you ensure data consistency in a distributed system?",
    "What is rate limiting and how would you implement it in an API?",
    "Explain JWT authentication. What are its advantages and security considerations?",
    "How do you handle database migrations in a production system without downtime?",
  ],

  // ── Full Stack ──
  'fullstack': [
    "Walk me through how a request travels from a React frontend to a Node.js backend to a database and back.",
    "How do you decide what logic belongs on the frontend vs the backend?",
    "Explain CORS. Why does it exist and how do you handle it in a full stack application?",
    "How would you implement real-time features like notifications or live chat in a web application?",
    "What is server-side rendering vs client-side rendering? When would you choose each?",
    "How do you handle user authentication across the frontend and backend securely?",
    "Explain the concept of API versioning. Why is it important and how do you implement it?",
    "How do you approach performance optimization in a full stack application end to end?",
    "What is the difference between cookies, localStorage, and sessionStorage? When do you use each?",
    "How would you design the data model for a social media feed with likes, comments and follows?",
    "Explain WebSockets. How do they differ from HTTP and when would you use them?",
    "How do you handle errors consistently across the full stack?",
  ],

  // ── Software Engineer (general) ──
  'software': [
    "Explain time and space complexity. What is Big O notation and why does it matter?",
    "What is the difference between a stack and a queue? Give a real use case for each.",
    "Explain object-oriented programming principles — encapsulation, inheritance, polymorphism.",
    "What is a binary search tree? What are its advantages and when would you use it?",
    "Explain the SOLID principles of software design.",
    "What is the difference between a process and a thread?",
    "Explain how a hash map works internally. What happens on a collision?",
    "What is dynamic programming? Explain with an example you have used.",
    "What is the difference between synchronous and asynchronous programming?",
    "Explain the MVC architecture pattern. Why is separation of concerns important?",
    "What is a deadlock? How do you prevent it?",
    "Explain the CAP theorem in distributed systems.",
  ],

  // ── Data Structures & Algorithms ──
  'dsa': [
    "What is the time complexity of quicksort in best, average and worst case? Why?",
    "Explain depth-first search vs breadth-first search. When would you use each?",
    "What is a heap data structure and when would you use a min-heap vs max-heap?",
    "Explain dynamic programming with a real problem you have solved.",
    "What is the difference between a linked list and an array? When is each better?",
    "Explain graph algorithms — Dijkstra vs Bellman-Ford. When does each fail?",
    "What is memoization and how does it differ from tabulation?",
    "Explain the two-pointer technique with an example problem.",
    "What is a trie and what problems is it especially suited for?",
    "Explain the sliding window technique and give a real problem where you used it.",
    "What is a segment tree and when would you use it over a simple array?",
    "Explain recursion vs iteration. What are the risks of deep recursion?",
  ],

  // ── System Design ──
  'systemdesign': [
    "How would you design a URL shortener like bit.ly? Walk me through your approach.",
    "Design a notification system that sends millions of push notifications per day.",
    "How would you design a rate limiter for a public API?",
    "Design a distributed cache system. How do you handle cache invalidation?",
    "How would you design the backend for a real-time collaborative document editor?",
    "Design a search autocomplete system for a large e-commerce platform.",
    "How would you design a system to detect fraudulent transactions in real time?",
    "Design a video streaming platform. How do you handle storage and delivery at scale?",
    "How would you design a job scheduling system like a cron service?",
    "Design a leaderboard system for a gaming platform with millions of users.",
    "How would you design a chat application that supports group messaging?",
    "Design an API gateway. What responsibilities should it have?",
  ],

  // ── DevOps / Cloud ──
  'devops': [
    "Explain the difference between Docker containers and virtual machines.",
    "What is Kubernetes and what problem does it solve?",
    "Explain CI/CD pipelines. How have you set one up and what did it include?",
    "What is infrastructure as code? What tools have you used?",
    "Explain the concept of blue-green deployment and canary releases.",
    "How do you monitor a production system? What metrics matter most?",
    "What is a reverse proxy? How does Nginx differ from a load balancer?",
    "Explain the 12-factor app methodology.",
    "How do you handle secrets and environment variables securely in production?",
    "What is a service mesh and when would you need one?",
    "Explain auto-scaling. What metrics would you use to trigger it?",
    "How do you approach disaster recovery planning for a critical system?",
  ],

  // ── Data Science / ML ──
  'datascience': [
    "Explain the bias-variance tradeoff. How does it affect model selection?",
    "What is the difference between supervised, unsupervised and reinforcement learning?",
    "Explain gradient descent. What is the difference between batch, stochastic and mini-batch?",
    "What is overfitting and how do you prevent it?",
    "Explain precision vs recall. When would you optimize for each?",
    "What is the difference between bagging and boosting? Give examples of each.",
    "How do you handle class imbalance in a classification problem?",
    "Explain the transformer architecture in LLMs at a high level.",
    "What is feature engineering and how does it impact model performance?",
    "Explain cross-validation. Why is a simple train-test split sometimes insufficient?",
    "What is regularization? Explain L1 vs L2 and when to use each.",
    "How would you explain a machine learning model decision to a non-technical stakeholder?",
  ],

  // ── Product Manager ──
  'product': [
    "How do you prioritize features when you have limited engineering resources?",
    "Walk me through how you would define success metrics for a new product feature.",
    "Describe your process for writing a product requirements document.",
    "How do you decide when a product is ready to launch?",
    "Tell me about a product decision you made that turned out to be wrong. What did you learn?",
    "How do you handle conflict between engineering and design teams?",
    "What frameworks do you use for product prioritization? Compare RICE vs MoSCoW.",
    "How would you increase user retention for a mobile app that has good acquisition but poor DAU?",
    "Walk me through how you would design an onboarding flow for a new B2B SaaS product.",
    "How do you measure product-market fit?",
    "Describe how you would run an A/B test for a new checkout flow.",
    "How do you balance short-term feature requests with long-term product vision?",
  ],

  // ── Mobile (iOS/Android/React Native) ──
  'mobile': [
    "Explain the difference between React Native and native development. What are the tradeoffs?",
    "What is the main thread in mobile development and why is it critical?",
    "How do you handle offline functionality in a mobile application?",
    "Explain the mobile app lifecycle. What happens when a user backgrounds your app?",
    "How do you optimize battery usage in a mobile application?",
    "What is the difference between push notifications and local notifications?",
    "How do you handle deep linking in a mobile app?",
    "Explain how you would implement biometric authentication in a mobile app.",
    "What strategies do you use for handling different screen sizes and orientations?",
    "How do you approach performance profiling in a mobile application?",
    "What is the App Store review process and what are common rejection reasons?",
    "How do you handle secure local storage on mobile devices?",
  ],

  // ── Cybersecurity ──
  'security': [
    "Explain the OWASP Top 10 vulnerabilities. Which have you personally tested for?",
    "What is SQL injection and how do you prevent it?",
    "Explain the difference between symmetric and asymmetric encryption.",
    "What is a man-in-the-middle attack? How do TLS certificates prevent it?",
    "Explain Cross-Site Request Forgery (CSRF) and how to defend against it.",
    "What is the principle of least privilege and how do you apply it?",
    "Explain penetration testing. What phases does a pen test typically follow?",
    "What is a zero-day vulnerability? How do organizations respond to one?",
    "Explain OAuth 2.0. How does it differ from OpenID Connect?",
    "What is a buffer overflow attack and what causes it at the code level?",
    "How do you securely store passwords in a database?",
    "Explain network segmentation and why it is important in enterprise security.",
  ],
}

// Role keyword matching
// Maps any role string to a question category
function detectCategory(jobRole) {
  const role = jobRole.toLowerCase()

  if (role.includes('frontend') || role.includes('front-end') ||
      role.includes('react') || role.includes('vue') || role.includes('angular') ||
      role.includes('ui') || role.includes('css')) {
    return 'frontend'
  }
  if (role.includes('backend') || role.includes('back-end') ||
      role.includes('node') || role.includes('python') || role.includes('java') ||
      role.includes('api') || role.includes('server') || role.includes('django') ||
      role.includes('spring')) {
    return 'backend'
  }
  if (role.includes('full stack') || role.includes('fullstack') ||
      role.includes('full-stack') || role.includes('mern') || role.includes('mean')) {
    return 'fullstack'
  }
  if (role.includes('data science') || role.includes('machine learning') ||
      role.includes('ml') || role.includes('ai engineer') || role.includes('nlp') ||
      role.includes('deep learning')) {
    return 'datascience'
  }
  if (role.includes('system design') || role.includes('architect') ||
      role.includes('principal') || role.includes('staff engineer')) {
    return 'systemdesign'
  }
  if (role.includes('devops') || role.includes('sre') || role.includes('cloud') ||
      role.includes('infrastructure') || role.includes('platform') ||
      role.includes('kubernetes') || role.includes('docker')) {
    return 'devops'
  }
  if (role.includes('mobile') || role.includes('ios') || role.includes('android') ||
      role.includes('react native') || role.includes('flutter')) {
    return 'mobile'
  }
  if (role.includes('security') || role.includes('cyber') ||
      role.includes('penetration') || role.includes('pen test')) {
    return 'security'
  }
  if (role.includes('product manager') || role.includes('product manager') ||
      role.includes('pm ') || role.includes('product owner')) {
    return 'product'
  }
  if (role.includes('dsa') || role.includes('algorithm') ||
      role.includes('competitive')) {
    return 'dsa'
  }

  // Default for any general software engineer role
  return 'software'
}

// Shuffle array — Fisher-Yates algorithm
// Ensures different questions every session
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Simulated delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─────────────────────────────────────────
// 1. GENERATE QUESTIONS
// Returns 10 questions — mix of role-specific + behavioral
// Different every time due to shuffling
// ─────────────────────────────────────────
exports.generateQuestions = async (jobRole, difficulty, count = 10) => {
  await delay(1500)

  const category       = detectCategory(jobRole)
  const roleQuestions  = ROLE_QUESTIONS[category] || ROLE_QUESTIONS['software']
  const behaviorPool   = BEHAVIORAL_QUESTIONS

  // Shuffle both pools
  const shuffledRole     = shuffle(roleQuestions)
  const shuffledBehavior = shuffle(behaviorPool)

  // Mix: 6 role-specific + 4 behavioral for 10 questions
  // This ratio gives a realistic interview balance
  const roleCount      = Math.ceil(count * 0.6)   // 6
  const behaviorCount  = count - roleCount          // 4

  const selected = [
    ...shuffledRole.slice(0, roleCount).map((text, i) => ({
      id:   i + 1,
      text: difficulty === 'hard'
        ? text + ' Be specific — include metrics, scale, and tradeoffs.'
        : text,
      type: 'technical',
      difficulty,
    })),
    ...shuffledBehavior.slice(0, behaviorCount).map((text, i) => ({
      id:   roleCount + i + 1,
      text,
      type: 'behavioral',
      difficulty,
    })),
  ]

  // Shuffle the final mix so behavioral and technical alternate naturally
  return shuffle(selected).map((q, i) => ({ ...q, id: i + 1 }))
}

// ─────────────────────────────────────────
// 2. EVALUATE AN ANSWER
// ─────────────────────────────────────────
exports.evaluateAnswer = async (question, transcript, jobRole) => {
  await delay(2000)

  if (!transcript || transcript.trim().length < 10) {
    return {
      relevance:   { score: 2, feedback: 'Answer was too short or unclear.' },
      structure:   { score: 2, feedback: 'No clear structure detected.' },
      depth:       { score: 2, feedback: 'Provide more detail and examples.' },
      overall_tip: 'Try to speak for at least 30-60 seconds per answer.'
    }
  }

  const wordCount = transcript.trim().split(/\s+/).length

  const baseScore = wordCount < 20  ? 4
                  : wordCount < 50  ? 6
                  : wordCount < 100 ? 7
                  : 8

  const vary = () => Math.min(10, Math.max(1,
    baseScore + Math.floor(Math.random() * 3) - 1
  ))

  const relevance = vary()
  const structure = vary()
  const depth     = vary()

  return {
    relevance: {
      score:    relevance,
      feedback: relevance >= 7
        ? 'You addressed the question directly and clearly.'
        : 'Try to more directly address what was asked.'
    },
    structure: {
      score:    structure,
      feedback: structure >= 7
        ? 'Good structured thinking in your answer.'
        : 'Try the STAR method — Situation, Task, Action, Result.'
    },
    depth: {
      score:    depth,
      feedback: depth >= 7
        ? 'Good use of specific examples and detail.'
        : 'Add concrete examples, numbers, or outcomes.'
    },
    overall_tip: getCoachingTip(relevance, structure, depth)
  }
}

// ─────────────────────────────────────────
// 3. ADAPT DIFFICULTY
// ─────────────────────────────────────────
exports.getNextDifficulty = (currentDifficulty, lastScore) => {
  if (lastScore >= 8) {
    if (currentDifficulty === 'easy')   return 'medium'
    if (currentDifficulty === 'medium') return 'hard'
  }
  if (lastScore <= 4) {
    if (currentDifficulty === 'hard')   return 'medium'
    if (currentDifficulty === 'medium') return 'easy'
  }
  return currentDifficulty
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function getCoachingTip(relevance, structure, depth) {
  const lowest = Math.min(relevance, structure, depth)
  if (lowest === relevance) {
    return 'Focus on directly answering what was asked before adding context.'
  }
  if (lowest === structure) {
    return 'Structure your answer — Situation, Task, Action, Result.'
  }
  return 'Add a specific example with a measurable outcome to show real impact.'
}
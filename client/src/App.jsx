import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import ProtectedRoute from './components/ProtectedRoute'
import SessionDetail from './pages/SessionDetail'
import HowItWorks from './pages/HowItWorks'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
<Route path="/interview/:id" element={                     //dynamic routing
  <ProtectedRoute><Interview /></ProtectedRoute>
} />
<Route path="/session/:id" element={
  <ProtectedRoute><SessionDetail /></ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

// Interview Page (IMPORTANT)
// <Route path="/interview/:id" element={<Interview />} />
// 🔥 VERY IMPORTANT CONCEPT

// 👉 :id = dynamic parameter

// 🧠 Kaise kaam karta hai?

// Example:

// /interview/123

// 👉 123 = id
// Why needed?

// 👉 Har interview session unique hota hai

// 👉 So:

// /interview/1
// /interview/2
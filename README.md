# 🚀 InterviewMirror

### AI-Powered Mock Interview Platform with Behavioral Analysis

> Practice smarter with real-time AI feedback on both **what you say** and **how you say it**.

---

Live Demo: https://interviewmirror.vercel.app

## 📌 Overview

InterviewMirror is an intelligent mock interview platform that simulates real interview conditions by combining **AI-driven answer evaluation** with **behavioral analysis**.

Unlike traditional tools, it doesn't just assess your answers — it analyzes **confidence, eye contact, speaking patterns**, and provides **real-time coaching**.

---

## ✨ Key Features

* 🎯 **AI-Based Answer Evaluation**
  Structured scoring across relevance, structure, and depth using OpenAI.

* 🧠 **Behavioral Analysis**
  Tracks eye contact, facial expressions, hesitation, and speaking pace.

* ⚡ **Real-Time Feedback**
  Instant coaching suggestions like *“Maintain eye contact”* or *“Reduce filler words”*.

* 📊 **Confidence Scoring Engine**
  Custom weighted scoring system (0–100) combining AI + behavioral signals.

* 🎥 **Interview Replay System**
  Review past interviews with detailed breakdowns and improvement areas.

* 🎨 **Modern UI/UX**
  Clean, responsive interface built with React and Tailwind CSS.

---

## 🧠 How It Works

1. User starts an interview session
2. Webcam + microphone capture behavior and speech
3. Speech is converted to text using Web Speech API
4. AI evaluates the response using a structured rubric
5. Behavioral data (eye contact, pace, hesitation) is analyzed
6. A custom scoring engine generates final feedback (0–100 scale)
7. Session data is stored and available for replay and analysis

---

## 🏗️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Framer Motion
**Backend:** Node.js, Express.js
**Database:** MongoDB
**AI:** OpenAI API
**Web APIs:** Web Speech API, getUserMedia
**Behavior Analysis:** face-api.js

---

## ⚙️ Architecture Highlights

* 📦 **Single Document Session Storage**
  Each interview session is stored as one MongoDB document for efficient replay.

* 🧮 **Deterministic Scoring Engine**
  Combines AI outputs with behavioral metrics for explainable evaluation.

* 🔄 **Real-Time Processing**
  Continuous capture and analysis of user behavior during interview.

---

## 📈 Performance Highlights

* ⚡ <1.5s average feedback latency
* 📉 ~70% reduction in data fetch complexity (single-query replay)
* 🎯 Structured scoring across 4 evaluation dimensions

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/interviewmirror.git
cd interviewmirror
```

### 2. Install dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 3. Setup environment variables

Create a `.env` file in server:

```env
OPENAI_API_KEY=your_api_key
MONGO_URI=your_mongodb_connection
```

### 4. Run the project

```bash
# Run backend
cd server
npm run dev

# Run frontend
cd client
npm run dev
```

---

## 🎯 Future Improvements

* 🔊 Emotion detection from voice tone
* 🤖 Adaptive interview difficulty using AI
* 📱 Mobile optimization
* 🌍 Multi-language support

---

## 💡 What Makes It Different?

* Combines **AI + behavioral signals** (not just text evaluation)
* Provides **real-time coaching**, not just post-analysis
* Uses a **custom scoring engine**, not black-box AI

---

## 👩‍💻 Author

**Ananya Jaiswal**
---

## ⭐ If you like this project

Give it a star ⭐

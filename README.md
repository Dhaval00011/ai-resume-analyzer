# 🚀 AI Resume Analyzer (MERN + Gemini AI)

An AI-powered Resume Analyzer built with **React**, **Node.js/Express**, and **Google Gemini API**. It calculates ATS compatibility scores, identifies skill gaps against specific job roles, and provides actionable recommendations and AI-driven feedback.

---

## 🌟 Key Features
- 📄 **Resume Parsing**: Seamless upload and text extraction for PDF and TXT resumes.
- 🎯 **ATS Score**: Comprehensive 0–100 ATS compatibility rating with dynamic status badges.
- 🔍 **Skill Gap Analysis**: Compares candidate skills against job requirements to highlight matched vs. missing skills.
- 💡 **Actionable Suggestions**: Specific tips to improve bullet points, quantifiable impact, and formatting.
- 🤖 **AI Feedback**: In-depth analysis of strengths, weaknesses, and recruiter impressions powered by Google Gemini.
- ⚡ **Offline Fallback Engine**: Works right out of the box even before you enter an API key!

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Modern Responsive UI, Clean CSS Design System
- **Backend**: Node.js, Express.js, Multer, pdf-parse, CORS, Dotenv
- **AI Integration**: Google Gemini 1.5 Flash API (REST / Fetch)

---

## 💻 Quick Start Guide (PC Setup)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your computer.

---

### Step 1: Start Backend Server
1. Open a terminal / command prompt:
```bash
cd backend
npm install
```
2. (Optional) Set up your Gemini API key in `.env`:
```bash
cp .env.example .env
```
Open `.env` and paste your Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: You can get a free API key at [Google AI Studio](https://aistudio.google.com/). If left blank, the app will automatically use its built-in heuristic analysis engine.

3. Run the backend:
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

---

### Step 2: Start Frontend (React)
1. Open a **second terminal window**:
```bash
cd frontend
npm install
npm run dev
```
2. Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Sample Resume Included
A sample resume file (`sample-resume.txt`) is included in the project root so you can test it immediately without needing to prepare a document!

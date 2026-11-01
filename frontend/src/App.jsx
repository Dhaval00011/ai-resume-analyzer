import React, { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('Full Stack Software Engineer (React, Node.js, Express, MongoDB)');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload your resume (PDF or TXT file).');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData
});

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Server error occurred during analysis.');
      }
      setAnalysis(resJson.data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const renderScoreBadge = (score) => {
    if (score >= 80) return <span className="badge-score badge-green">Excellent ATS Match</span>;
    if (score >= 60) return <span className="badge-score badge-yellow">Moderate ATS Match</span>;
    return <span className="badge-score badge-red">Needs Optimization</span>;
  };

  return (
    <div className="container">
      <header className="header">
        <span className="badge-tag">DHAVAL DANGAR</span>
        <h1>Resume Analyzer</h1>
        <p>Instant ATS scoring, skill gap diagnostics, and Gemini AI actionable feedback</p>
      </header>

      {/* Upload Card */}
      <div className="card">
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>Target Job Role / Description</label>
            <input
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g., Senior Full Stack Engineer, React Developer..."
            />
          </div>

          <div className="form-group">
            <label>Upload Resume File</label>
            <div
              className="upload-dropzone"
              onClick={() => document.getElementById('fileUploadInput').click()}
            >
              <input
                id="fileUploadInput"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div className="upload-icon">📄</div>
              <div className="upload-title">
                {file ? `Selected: ${file.name}` : 'Click or Drag & Drop Resume File'}
              </div>
              <div className="upload-subtitle">
                Supports PDF or TXT format (up to 5MB)
              </div>
            </div>
          </div>

          {error && (
            <p style={{ color: '#f87171', marginBottom: '1.2rem', fontWeight: 600 }}>
              ⚠️ {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Analyzing with AI...' : 'Analyze Resume'}
          </button>
        </form>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div>
          {/* ATS Score and Executive Summary */}
          <div className="card results-grid">
            <div className="score-box">
              <div className="score-dial">
                <span className="score-number">{analysis.atsScore}</span>
                <span className="score-text">ATS SCORE</span>
              </div>
              {renderScoreBadge(analysis.atsScore)}
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Executive Assessment
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '1.25rem' }}>
                {analysis.summary}
              </p>

              <h3 style={{ fontSize: '1.05rem', color: '#4ade80', marginBottom: '0.35rem' }}>
                Standout Strengths
              </h3>
              <ul className="bullet-list" style={{ marginBottom: '1.2rem' }}>
                {analysis.strengths?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h3 style={{ fontSize: '1.05rem', color: '#f87171', marginBottom: '0.35rem' }}>
                Identified Weaknesses
              </h3>
              <ul className="bullet-list danger">
                {analysis.weaknesses?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="card">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>
              Skill Gap Analysis
            </h2>

            <div className="skill-group">
              <label style={{ color: '#4ade80' }}>
                ✓ Matched Skills Found on Resume ({analysis.matchedSkills?.length || 0}):
              </label>
              <div className="skill-pills">
                {analysis.matchedSkills?.length > 0 ? (
                  analysis.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="pill pill-success">{skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#64748b' }}>No direct keyword matches detected.</span>
                )}
              </div>
            </div>

            <div className="skill-group" style={{ marginBottom: 0 }}>
              <label style={{ color: '#f87171' }}>
                ✦ Missing In-Demand Skills for Target Role ({analysis.missingSkills?.length || 0}):
              </label>
              <div className="skill-pills">
                {analysis.missingSkills?.length > 0 ? (
                  analysis.missingSkills.map((skill, idx) => (
                    <span key={idx} className="pill pill-danger">+{skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#64748b' }}>Awesome! All primary keywords matched.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Improvement Suggestions */}
          <div className="card">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.8rem' }}>
              Recommendations for Higher ATS Ranking
            </h2>
            <ul className="bullet-list warning">
              {analysis.suggestions?.map((suggestion, idx) => (
                <li key={idx} style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

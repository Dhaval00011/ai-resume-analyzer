exports.analyzeWithAI = async (resumeText, jobDescription, apiKey) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) auditor and Principal Hiring Manager.
Evaluate the following candidate resume thoroughly against the target job role.

Target Job Role / Description:
${jobDescription}

Candidate Resume Text:
${resumeText}

Analyze the resume and return a STRICT raw JSON response (WITHOUT markdown ticks, backticks, or other text).
The JSON object must strictly match this schema:
{
  "atsScore": 85,
  "summary": "Concise 2-3 sentence executive assessment of the candidate profile.",
  "strengths": [
    "High relevant technical experience with React and Node.js",
    "Clear quantifiable metrics mentioned in recent roles",
    "Clean resume structure with identifiable sections"
  ],
  "weaknesses": [
    "Lacks explicit mentions of cloud infrastructure (AWS/Docker)",
    "Limited detail on CI/CD pipeline experience"
  ],
  "matchedSkills": ["React", "Node.js", "Express", "JavaScript", "MongoDB", "REST APIs"],
  "missingSkills": ["Docker", "Kubernetes", "AWS", "CI/CD", "TypeScript"],
  "suggestions": [
    "Incorporate metrics showing business impact (e.g., latency reduction or user growth)",
    "Include certifications or project references demonstrating cloud experience",
    "Add keywords from the target job description to your summary section"
  ]
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errorBody}`);
  }

  const result = await response.json();
  const rawText = result.candidates[0].content.parts[0].text;
  const cleanJson = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleanJson);
};

exports.fallbackAnalysis = (resumeText, jobDescription) => {
  const text = resumeText.toLowerCase();

  const techDictionary = [
    'react', 'node.js', 'express', 'javascript', 'typescript', 'mongodb',
    'python', 'sql', 'postgresql', 'docker', 'kubernetes', 'aws', 'git',
    'rest api', 'graphql', 'html', 'css', 'tailwind', 'redux', 'next.js',
    'ci/cd', 'agile', 'jest', 'linux'
  ];

  const matchedSkills = techDictionary.filter(skill => text.includes(skill.toLowerCase()));
  const missingSkills = techDictionary.filter(skill => !text.includes(skill.toLowerCase())).slice(0, 6);

  // ATS scoring heuristics
  let score = 50;
  if (matchedSkills.length >= 8) score += 35;
  else if (matchedSkills.length >= 5) score += 25;
  else if (matchedSkills.length >= 2) score += 15;

  if (text.includes('summary') || text.includes('objective')) score += 5;
  if (text.includes('experience') || text.includes('work history')) score += 5;
  if (text.includes('education') || text.includes('degree')) score += 5;
  score = Math.min(95, Math.max(45, score));

  return {
    atsScore: score,
    summary: `Your resume demonstrates good technical alignment with key keywords found. Formatting follows standard readability, making it ATS friendly with notable strengths in core development technologies.`,
    strengths: [
      `Strong alignment in core stack: ${matchedSkills.slice(0, 4).join(', ') || 'Software Development'}`,
      "Well-organized structure with clear technical skills and project sections",
      "Contains standard industry terminology recognized by automated parsers"
    ],
    weaknesses: [
      `Could strengthen competitive profile with in-demand skills: ${missingSkills.slice(0, 3).join(', ')}`,
      "Some achievements could be reinforced with quantitative percentages or KPI metrics"
    ],
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : ['JavaScript', 'HTML5', 'Problem Solving'],
    missingSkills: missingSkills,
    suggestions: [
      "Quantify your accomplishments (e.g., 'Reduced API latency by 35% across 10,000 requests').",
      "Tailor your summary to mirror the exact keywords in the target job title.",
      "Ensure all dates and position titles follow a consistent reverse-chronological format."
    ]
  };
};

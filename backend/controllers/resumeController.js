const multer = require('multer');
const pdfParse = require('pdf-parse');
const { analyzeWithAI, fallbackAnalysis } = require('../services/aiService');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a PDF or TXT file only.'));
    }
  }
});

exports.uploadMiddleware = upload.single('resume');

exports.analyzeResume = async (req, res) => {
  try {
    let resumeText = '';
    const jobDescription = req.body.jobDescription || 'Full Stack Software Engineer (MERN Stack)';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        const parsed = await pdfParse(req.file.buffer);
        resumeText = parsed.text;
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: 'No resume file or text content uploaded.' });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded file.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let analysisResult;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        analysisResult = await analyzeWithAI(resumeText, jobDescription, apiKey);
      } catch (aiErr) {
        console.warn('Gemini AI failed, using fallback engine:', aiErr.message);
        analysisResult = fallbackAnalysis(resumeText, jobDescription);
      }
    } else {
      analysisResult = fallbackAnalysis(resumeText, jobDescription);
    }

    return res.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return res.status(500).json({
      error: 'Failed to analyze resume',
      details: error.message
    });
  }
};

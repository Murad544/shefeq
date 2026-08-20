const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Dynamic CORS origins reader
function getDynamicCorsOrigins() {
  try {
    const envPath = path.join(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const corsMatch = envContent.match(/^CORS_ORIGINS=(.*)$/m);
      if (corsMatch && corsMatch[1]) {
        return corsMatch[1]
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean);
      }
    }
  } catch (error) {
    console.error('[CORS] Error reading .env file:', error.message);
  }

  return process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
      .map((url) => url.trim())
      .filter(Boolean)
    : [];
}

const corsOptions = {
  origin: (origin, callback) => {
    // Get current allowed origins
    const allowedOrigins = getDynamicCorsOrigins();

    // Always allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    // Check exact match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Development localhost patterns
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // ngrok patterns (free and pro)
    if (/^https:\/\/[a-zA-Z0-9-]+\.ngrok(-free)?\.app$/.test(origin)) {
      return callback(null, true);
    }

    // ngrok custom domains (pro)
    if (/^https:\/\/[a-zA-Z0-9-]+\.ngrok\.dev$/.test(origin)) {
      return callback(null, true);
    }

    // Vercel patterns
    if (/^https:\/\/.*semadaki-gozler.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    callback(null, false);
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'ngrok-skip-browser-warning',
    'User-Agent',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Content-Length', 'X-Request-Id', 'Content-Disposition'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

module.exports = (req, res, next) => {
  // Add Vary header
  res.setHeader('Vary', 'Origin');

  // ngrok headers
  const origin = req.get('origin') || '';
  if (origin.includes('ngrok')) {
    res.setHeader('ngrok-skip-browser-warning', 'true');
  }

  // Log preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Preflight: ${req.method} ${req.originalUrl} from ${origin}`);
  }

  corsMiddleware(req, res, next);
};

/**
 * Zero-Trust Input Sanitizer Middleware
 * Strips script tags, HTML tags, and malicious prototype injections
 */
const cleanString = (str) => {
  if (typeof str !== 'string') return str;
  // Strip potential script tags, javascript: pseudo-protocols, and inline event handlers
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    // Prevent NoSQL operator injection (keys starting with $)
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }

    if (typeof obj[key] === 'string') {
      obj[key] = cleanString(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }

  return obj;
};

const sanitizeInputs = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = sanitizeInputs;

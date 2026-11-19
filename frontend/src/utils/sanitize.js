/**
 * Client-Side Input Sanitizer
 * Strips executable tags and dangerous characters before rendering or sending
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

/**
 * Vercel Serverless entry point for the DF TaskManager backend.
 *
 * Vercel long-running server (app.listen) nahi chalata — har request ek
 * serverless function hoti hai. Is liye yahan sirf Express app export hoti
 * hai, server start NAHI hota. `src/server.js` sirf local / Render ke liye
 * hai (wahan `npm start` chalta hai).
 *
 * Vercel is file ko `backend/api/index.js` se detect karke function banata
 * hai, aur `backend/vercel.json` ki rewrites har request ko yahan bhejti
 * hain — is liye /api/v1/health, /api/v1/auth, /api/v1/tasks sab kaam karte
 * hain.
 */
const app = require('../src/app');

module.exports = app;

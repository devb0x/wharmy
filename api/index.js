const app = require('../backend/app'); // Load your Express app
const serverless = require('serverless-http')
module.exports = serverless(app); // Wrap it for Vercel

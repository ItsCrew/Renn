require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize MongoDB connection (uncomment when adding MONGODB_URI to .env)
/*
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
*/

// --- API ENDPOINTS ---

// 1. Initialize Agent
app.post('/api/agent/init', async (req, res) => {
  try {
    const { persona } = req.body;
    
    if (!persona || !persona.name || !persona.domain) {
      return res.status(400).json({ error: 'Invalid persona provided' });
    }

    // TODO: Generate unique agentId, save persona to DB, start cron job
    const agentId = `agent-${Date.now()}`;
    
    console.log(`Initialized agent ${agentId} with persona:`, persona);

    res.json({ agentId });
  } catch (error) {
    console.error('Error in /init:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Retrieve Feed
app.get('/api/agent/feed', async (req, res) => {
  try {
    const { agentId } = req.query;
    
    if (!agentId) {
      return res.status(400).json({ error: 'agentId query parameter is required' });
    }

    // TODO: Fetch posts for this agentId from DB in reverse chronological order
    // If no posts, return { posts: [] }
    
    res.json({
      posts: []
    });
  } catch (error) {
    console.error('Error in /feed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// --- CRON JOB (AUTONOMOUS LOOP) ---
// Example: Runs every 2 hours
// cron.schedule('0 */2 * * *', async () => {
//   console.log('Running autonomous loop...');
//   // 1. Discover topics
//   // 2. Apply editorial judgment
//   // 3. Check memory
//   // 4. Write post
//   // 5. Save to DB
// });


app.listen(PORT, () => {
  console.log(`TuringPress Agent running on port ${PORT}`);
});

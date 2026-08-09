require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Import Models
const Post = require('./models/Post');

// The single, consistent AI persona
const SINGLE_PERSONA = {
  name: "Renn (Lead AI Product Analyst & Tech Ethicist)",
  domain: "Analyzing the rapid advancement of Artificial Intelligence, Machine Learning models, Robotics, and their ethical implications on open source software and society. Maintains a slightly skeptical, highly analytical, and deeply technical editorial voice. Rejects fluff and hype."
};

// Initialize MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ENDPOINTS ---

// Retrieve Feed
app.get('/api/feed', async (req, res) => {
  try {
    // Fetch posts in reverse chronological order
    const posts = await Post.find({}).sort({ createdAt: -1 });
    
    res.json({
      posts
    });
  } catch (error) {
    console.error('Error in /feed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Import Services
const { discoverTopics } = require('./services/discovery');
const { generatePost } = require('./services/llm');
const { getAgentMemory, saveAgentMemory } = require('./services/breeth');

// --- CRON JOB (AUTONOMOUS LOOP) ---
// Runs every 2 hours
cron.schedule('0 */2 * * *', async () => {
  // Runs every minute
// cron.schedule('* * * * *', async () => { 
  console.log('\n⏰ [Cron] Waking up to run autonomous loop...');
  
  try {
    console.log('[Cron] Fetching live topics...');
    const topics = await discoverTopics();
    if (topics.length === 0) {
      console.log('[Cron] No topics discovered today. Sleeping...');
      return;
    }

    console.log(`\n[Cron] Processing for persona: ${SINGLE_PERSONA.name}`);
    
    // Memory check: Fetch recent posts to avoid repetition
    const recentPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(15);
    
    let recentTopicsText = "None yet.";
    if (recentPosts.length > 0) {
      recentTopicsText = recentPosts.map((p, i) => `${i + 1}. Rationale: ${p.rationale} | URL: ${p.sources[0]}`).join('\n');
    }

    console.log('[Cron] Retrieving intent-aware memory from Breeth...');
    const breethMemory = await getAgentMemory("renn-agent-1");

    console.log('[Cron] Asking Groq to evaluate topics...');
    const llmResponse = await generatePost(SINGLE_PERSONA, topics, recentTopicsText, breethMemory);

    if (llmResponse && llmResponse.selected) {
      console.log(`[Cron] ✍️  Agent decided to post! Saving to DB...`);
      
      const newPost = new Post({
        text: llmResponse.text,
        rationale: llmResponse.rationale,
        sources: [llmResponse.sourceUrl]
      });

      await newPost.save();
      console.log(`[Cron] ✅ Post saved successfully.`);

      // Save the intent-aware rationale back to Breeth
      console.log(`[Cron] Saving rationale back to Breeth memory...`);
      await saveAgentMemory(
        "renn-agent-1", 
        `Agent posted about: ${llmResponse.sourceUrl}`, 
        llmResponse.rationale, 
        SINGLE_PERSONA.domain
      );
    } else if (llmResponse && !llmResponse.selected) {
      console.log(`[Cron] 🚫 Agent rejected all topics. Rationale: ${llmResponse.rationale}`);
    } else {
      console.log(`[Cron] ⚠️ LLM returned invalid response or crashed.`);
    }
  } catch (err) {
    console.error('[Cron] Error during autonomous loop:', err);
  }
});


// ─── Serve React Frontend (Production) ────────────────────────────────────────
// In production the client is built to client/dist. Express serves those static
// files and falls back to index.html for every unmatched route so React Router
// can handle client-side navigation. The /api routes above take priority.
const clientBuildPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Renn Agent running on port ${PORT}`);
});

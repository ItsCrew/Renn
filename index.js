require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Import Models
const Agent = require('./models/Agent');
const Post = require('./models/Post');

// Initialize MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ENDPOINTS ---

// 1. Initialize Agent
app.post('/api/agent/init', async (req, res) => {
  try {
    const { persona } = req.body;
    
    if (!persona || !persona.name || !persona.domain) {
      return res.status(400).json({ error: 'Invalid persona provided' });
    }

    // Generate unique agentId
    const agentId = `agent-${Date.now()}`;
    
    // Save Agent to DB
    const newAgent = new Agent({
      agentId,
      persona
    });
    
    await newAgent.save();

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

    // Fetch posts for this agentId in reverse chronological order
    const posts = await Post.find({ agentId }).sort({ createdAt: -1 });
    
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

// --- CRON JOB (AUTONOMOUS LOOP) ---
// Runs every 2 hours
// cron.schedule('0 */2 * * *', async () => {
cron.schedule('* * * * *', async () => {
  console.log('\n⏰ [Cron] Waking up to run autonomous loop...');
  
  try {
    const agents = await Agent.find();
    if (agents.length === 0) {
      console.log('[Cron] No active agents found. Sleeping...');
      return;
    }

    console.log('[Cron] Fetching live topics...');
    const topics = await discoverTopics();
    if (topics.length === 0) {
      console.log('[Cron] No topics discovered today. Sleeping...');
      return;
    }

    for (const agent of agents) {
      console.log(`\n[Cron] Processing agent: ${agent.persona.name} (${agent.agentId})`);
      
      // Memory check: Fetch recent posts to avoid repetition
      const recentPosts = await Post.find({ agentId: agent.agentId })
        .sort({ createdAt: -1 })
        .limit(10);
      
      let recentTopicsText = "None yet.";
      if (recentPosts.length > 0) {
        recentTopicsText = recentPosts.map((p, i) => `${i + 1}. Rationale: ${p.rationale} | URL: ${p.sources[0]}`).join('\n');
      }

      console.log('[Cron] Asking Groq to evaluate topics...');
      const llmResponse = await generatePost(agent.persona, topics, recentTopicsText);

      if (llmResponse && llmResponse.selected) {
        console.log(`[Cron] ✍️  Agent decided to post! Saving to DB...`);
        
        const newPost = new Post({
          agentId: agent.agentId,
          text: llmResponse.text,
          rationale: llmResponse.rationale,
          sources: [llmResponse.sourceUrl]
        });

        await newPost.save();
        console.log(`[Cron] ✅ Post saved successfully.`);
      } else if (llmResponse && !llmResponse.selected) {
        console.log(`[Cron] 🚫 Agent rejected all topics. Rationale: ${llmResponse.rationale}`);
      } else {
        console.log(`[Cron] ⚠️ LLM returned invalid response or crashed.`);
      }
    }
  } catch (err) {
    console.error('[Cron] Error during autonomous loop:', err);
  }
});


app.listen(PORT, () => {
  console.log(`Renn Agent running on port ${PORT}`);
});

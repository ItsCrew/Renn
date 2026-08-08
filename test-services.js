require('dotenv').config();
const { discoverTopics } = require('./services/discovery');
const { generatePost } = require('./services/llm');

async function runTest() {
  console.log("🚀 Starting Service Test...\n");

  console.log("1️⃣ Fetching Live Topics via RSS...");
  const topics = await discoverTopics();
  console.log(`✅ Discovered ${topics.length} topics.\n`);
  
  if (topics.length > 0) {
    console.log("First discovered topic preview:");
    console.log(`- ${topics[0].title}`);
  }

  // A fake persona to test if the LLM adopts it
  const dummyPersona = {
    name: "Ada",
    domain: "AI Security"
  };

  // A fake list of recent posts to test if the LLM avoids repeating itself
  const dummyRecentPosts = "1. AI Regulations in the EU. 2. How to secure LLM endpoints.";

  console.log("\n2️⃣ Sending topics to Groq for Editorial Judgment...");
  console.log(`Using Persona: ${dummyPersona.name} (${dummyPersona.domain})\n`);
  
  const result = await generatePost(dummyPersona, topics, dummyRecentPosts);

  console.log("3️⃣ Groq Response (JSON):");
  console.log(JSON.stringify(result, null, 2));
}

runTest();

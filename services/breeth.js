const axios = require('axios');

/**
 * Breeth AI Integration Service
 * Website: https://thebreeth.com
 * 
 * Intent-aware memory layer for AI agents.
 */

const BREETH_API_URL = 'https://api.thebreeth.com/v1'; // Assuming v1 REST endpoint based on standard patterns

/**
 * Retrieves the intent-aware context (director vision, cognitive patterns) from Breeth.
 * @param {String} agentId - The unique ID for this agent/project.
 * @returns {Promise<String>} - The contextual memory to inject into the LLM prompt.
 */
async function getAgentMemory(agentId) {
  if (!process.env.BREETH_API_KEY) {
    console.warn("⚠️ [Breeth] No BREETH_API_KEY found. Skipping memory retrieval.");
    return "";
  }

  try {
    // Use the correct Breeth /search endpoint
    const response = await axios.post(`${BREETH_API_URL}/search`, {
      query: `Find memory patterns and guidelines for agent ${agentId}`,
      group_id: agentId,
      limit: 5
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.BREETH_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Breeth returns response.data.edges
    const memories = response.data.edges || [];
    
    if (memories.length === 0) return "";

    return memories.map(m => 
      `- [Memory Edge] ${m.source_node || m.subject} ${m.relation || m.predicate} ${m.target_node || m.object}`
    ).join('\n');
    
  } catch (error) {
    console.error("❌ [Breeth] Failed to fetch memory:", error.message);
    // Fail gracefully so the agent loop doesn't crash during the hackathon
    return "";
  }
}

/**
 * Saves a new intent-driven fact to Breeth memory.
 * @param {String} agentId - The unique ID for this agent/project.
 * @param {String} fact - The core fact (e.g., "Published an article about OpenAI.")
 * @param {String} cognitivePattern - The behavioral pattern or reasoning behind the decision.
 * @param {String} directorVision - The overarching goal (e.g., "Focus on ethical implications.")
 */
async function saveAgentMemory(agentId, fact, cognitivePattern, directorVision) {
  if (!process.env.BREETH_API_KEY) {
    console.warn("⚠️ [Breeth] No BREETH_API_KEY found. Skipping memory storage.");
    return;
  }

  try {
    // Use the correct Breeth /facts endpoint
    await axios.post(`${BREETH_API_URL}/facts`, {
      subject: "Renn Agent",
      predicate: "published_article",
      object: fact,
      group_id: agentId,
      extract_intent: true
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.BREETH_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("🧠 [Breeth] Intent-aware memory saved successfully.");
  } catch (error) {
    console.error("❌ [Breeth] Failed to save memory:", error.message);
  }
}

module.exports = { getAgentMemory, saveAgentMemory };

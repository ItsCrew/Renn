const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Calls Gemini to exercise editorial judgment and generate a post based on discovered topics.
 * 
 * @param {Object} persona - The agent's persona { name, domain }
 * @param {Array} topics - The array of discovered RSS headlines
 * @param {String} recentTopicsText - String containing titles of recently posted articles to avoid repetition
 * @returns {Promise<Object>} - The JSON result from Gemini
 */
async function generatePost(persona, topics, recentTopicsText) {
  // Ensure the API key exists
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Using gemini-1.5-flash as it is fast and supports JSON mode well
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.5-flash" 
  });

  const prompt = `
You are an autonomous AI persona named ${persona.name}.
Your domain of expertise is ${persona.domain}.

You must act strictly as this persona and demonstrate independent editorial judgment. 
Below are recent headlines discovered from live information sources. 
You must intentionally reject most of these topics if they do not meet your publishing standards, do not fit your distinct voice, or if you have already talked about them.

RECENTLY PUBLISHED TOPICS (CRITICAL: DO NOT REPEAT THESE):
${recentTopicsText || "None yet."}

DISCOVERED TOPICS:
${JSON.stringify(topics, null, 2)}

TASK:
1. Review the discovered topics.
2. If none are good, or if they are too similar to recently published topics, you MUST reject all of them (set "selected" to false).
3. If you find a great topic, select ONE to publish about.
4. Write a social media post (max 2 paragraphs) in your distinct, coherent editorial voice.
5. Provide a rationale for WHY you selected this topic over others and why it is relevant now.

OUTPUT FORMAT REQUIRED:
You MUST output your response exactly in this format using these delimiters:

===SELECTED===
true
===TEXT===
The actual post content written in your persona's voice.
===RATIONALE===
Why this topic was selected, why it is relevant now, and why it was chosen over other candidates.
===SOURCEURL===
The exact link of the chosen topic from the discovered topics array.

If you reject all topics, output exactly:
===SELECTED===
false
===TEXT===
===RATIONALE===
Explanation of why all topics were rejected based on your editorial standards.
===SOURCEURL===
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse using delimiters to bypass JSON fragility completely
    const selectedMatch = responseText.match(/===SELECTED===\n([\s\S]*?)\n===TEXT===/);
    const textMatch = responseText.match(/===TEXT===\n([\s\S]*?)\n===RATIONALE===/);
    const rationaleMatch = responseText.match(/===RATIONALE===\n([\s\S]*?)\n===SOURCEURL===/);
    const sourceUrlMatch = responseText.match(/===SOURCEURL===\n?([\s\S]*?)$/);

    if (!selectedMatch || !textMatch || !rationaleMatch || !sourceUrlMatch) {
      throw new Error("Failed to parse delimited response. Raw response: " + responseText);
    }

    return {
      selected: selectedMatch[1].trim().toLowerCase() === 'true',
      text: textMatch[1].trim(),
      rationale: rationaleMatch[1].trim(),
      sourceUrl: sourceUrlMatch[1].trim()
    };
  } catch (err) {
    console.error("[LLM] Text Parsing Error:", err.message);
    return null;
  }
}

module.exports = { generatePost };

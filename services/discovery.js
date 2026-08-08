const Parser = require('rss-parser');
const parser = new Parser();

// Array of tech and AI RSS feeds for the agent to read
const FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://hnrss.org/frontpage',       // Hacker News front page
  'https://hnrss.org/newest?q=AI',     // Hacker News posts mentioning AI
  'https://www.wired.com/feed/category/science/latest/rss'
];

/**
 * Fetches recent articles from multiple RSS feeds.
 * @returns {Promise<Array>} Array of article objects { title, link, snippet }
 */
async function discoverTopics() {
  let allItems = [];
  
  for (const feedUrl of FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      feed.items.forEach(item => {
        allItems.push({
          title: item.title,
          link: item.link,
          snippet: item.contentSnippet || item.content || ''
        });
      });
    } catch (err) {
      console.error(`[Discovery] Failed to fetch RSS from ${feedUrl}:`, err.message);
    }
  }

  // Shuffle and limit to 15 items so we don't exceed the LLM context window limits
  // and to ensure variety every time the agent wakes up.
  allItems = allItems.sort(() => 0.5 - Math.random()).slice(0, 15);
  
  return allItems;
}

module.exports = { discoverTopics };

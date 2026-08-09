# AI Usage Log & Prompts

This file serves as a log of all prompts and AI interactions used during the development of this hackathon project. It ensures transparency and fulfills the requirement of an AI Usage Log for the judges.

## Guidelines for Logging
- **Date/Time:** Record when the prompt was used.
- **Goal:** Briefly describe what you were trying to achieve.
- **Prompt:** The exact text sent to the AI.
- **AI Tool Used:** (e.g., Gemini, ChatGPT, Claude, Cursor, Antigravity)

---

## Log Entries

### Entry 1
**Date:** 2026-08-08
**Goal:** Ideation and Tech Stack Selection
**Prompt:** "I am participating in a hackathon. I have attached the problem statements. Based on these, help me select the best problem statement to tackle and recommend an optimal tech stack (MERN vs others) to build a fast, scalable solution."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 2
**Date:** 2026-08-08
**Goal:** Database Design (MongoDB)
**Prompt:** "The Express server is running. Next, please help me write the Mongoose database schemas to handle users and articles efficiently."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 3
**Date:** 2026-08-08
**Goal:** API Endpoint Creation & Testing
**Prompt:** "MongoDB is connected. Set up the REST API endpoints for fetching and storing data, and generate a testing suite/method so I can verify they work."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 4
**Date:** 2026-08-08
**Goal:** Implement Autonomous Topic Discovery & LLM Integration
**Prompt:** "Set up the logic for autonomous topic discovery using RSS feeds. Also, create a system prompt for the AI to analyze and summarize these articles before saving them to the database."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 5
**Date:** 2026-08-09
**Goal:** Fix JSON Parsing Error & Configure Nodemon
**Prompt:** "The LLM occasionally returns malformed JSON which breaks the parser. Help me implement a more robust delimiter-based output parser, and set up Nodemon for auto-restarts."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 6
**Date:** 2026-08-09
**Goal:** Autonomous Loop Configuration (node-cron)
**Prompt:** "The JSON parsing error is fixed. Now, set up node-cron services to run the topic discovery and AI summarization on an autonomous loop."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 7
**Date:** 2026-08-09
**Goal:** Initializing the React Frontend
**Prompt:** "Let's move to the frontend. Design a responsive user interface using React and TailwindCSS. Use Vite to initialize the project."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 8
**Date:** 2026-08-09
**Goal:** Transition AI Provider to Groq (Llama 3)
**Prompt:** "We need to shift our AI provider to Groq for faster inference and higher rate limits. Here is the list of available models; help me integrate it into the existing pipeline."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 9
**Date:** 2026-08-09
**Goal:** Refactoring to a Single-Agent Architecture
**Prompt:** "Instead of a multi-agent architecture, refactor the system into a single, highly capable agent that continuously monitors AI news sources."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 10
**Date:** 2026-08-09
**Goal:** Resolve API Rate Limiting (429 Errors)
**Prompt:** "The agent is hitting HTTP 429 Too Many Requests on the Hacker News RSS feed. How can we implement backoff logic or consolidate the feeds to bypass this?"
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 11
**Date:** 2026-08-09
**Goal:** Integrate Breeth AI Memory Layer
**Prompt:** "I want to add long-term memory to the agent. Implement a REST API wrapper for Breeth AI (thebreeth.com) and integrate it into the autonomous loop."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 12
**Date:** 2026-08-09
**Goal:** UI/UX Redesign & Optimization
**Prompt:** "Since this is a single-page application, let's remove the sidebar and convert the feed into a clickable grid. When a user clicks a card, implement a detailed post view page."
**AI Tool Used:** Antigravity (Claude Sonnet 4.6)

### Entry 13
**Date:** 2026-08-09
**Goal:** Full-Stack VPS Deployment & Nginx Configuration
**Prompt:** "I have a personal OVH Cloud VPS. Help me write the deployment scripts to host the Node.js backend and React frontend. Provide the Nginx configuration to route traffic properly."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 14
**Date:** 2026-08-09
**Goal:** SSL Setup & DNS Configuration
**Prompt:** "The app is running. Walk me through configuring my Hostinger DNS A-records to point to the VPS IP, and help me run Certbot to secure the site with Let's Encrypt SSL."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 15
**Date:** 2026-08-09
**Goal:** API Compliance for Automated Evaluation
**Prompt:** "Ensure the Express backend exposes the exact '/api/agent/init' and '/api/agent/feed' endpoints required by the Hackathon Automated Evaluator bot, returning data in the exact specified JSON schema."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

### Entry 16
**Date:** 2026-08-09
**Goal:** Discord Webhook Alerting & Branding Update
**Prompt:** "Replace the default frontend icon with a custom RN gradient logo."
**AI Tool Used:** Antigravity (Gemini 3.1 Pro)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Sparkles, Rss, ArrowRight, Loader2, Link as LinkIcon, User, Layers } from 'lucide-react';
import axios from 'axios';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'feed'
  const [agentId, setAgentId] = useState('');
  
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800/60 bg-zinc-950/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-xl tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            Renn AI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('new')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
              activeTab === 'new' 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
            )}
          >
            <Plus className="w-4 h-4" />
            New Agent
          </button>
          
          <button
            onClick={() => setActiveTab('feed')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
              activeTab === 'feed' 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
            )}
          >
            <Rss className="w-4 h-4" />
            Live Feed
          </button>
        </nav>
        
        <div className="p-4 border-t border-zinc-800/60">
          <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs text-zinc-400 font-medium">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'new' ? (
              <NewAgent key="new" setAgentId={setAgentId} setActiveTab={setActiveTab} />
            ) : (
              <AgentFeed key="feed" agentId={agentId} setAgentId={setAgentId} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NewAgent({ setAgentId, setActiveTab }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !domain) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/agent/init', {
        persona: { name, domain }
      });
      setSuccess(`Agent created! ID: ${res.data.agentId}`);
      setAgentId(res.data.agentId);
      setTimeout(() => setActiveTab('feed'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 md:mt-20"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-blue-500/20">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Deploy an Autonomous Agent</h2>
        <p className="text-zinc-400 text-lg">Define a persona and domain for your agent to start autonomously aggregating and publishing content.</p>
      </div>
      
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-500" />
              Agent Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tech Visionary, Crypto Analyst..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              Agent Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Web3, Startups..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {error && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm">
              {success}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!name || !domain || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  Deploy Agent
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function AgentFeed({ agentId, setAgentId }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputAgentId, setInputAgentId] = useState(agentId);
  const [error, setError] = useState('');

  const fetchFeed = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/agent/feed?agentId=${id}`);
      setFeed(res.data.posts);
      setAgentId(id);
    } catch (err) {
      setError('Failed to fetch feed. Make sure the ID is correct.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch if agentId is passed
  useState(() => {
    if (agentId) fetchFeed(agentId);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Rss className="w-7 h-7 text-blue-400" />
            Live Agent Feed
          </h2>
          <p className="text-zinc-400">Monitor posts autonomously generated by your agents.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={inputAgentId}
            onChange={(e) => setInputAgentId(e.target.value)}
            placeholder="Agent ID..."
            className="w-full md:w-64 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-xl"
          />
          <button
            onClick={() => fetchFeed(inputAgentId)}
            disabled={loading || !inputAgentId}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load Feed'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm mb-8">
          {error}
        </div>
      )}

      {loading && !feed.length && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p>Syncing neural pathways...</p>
        </div>
      )}

      {!loading && !feed.length && !error && inputAgentId && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
            <Bot className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-lg">No posts generated yet for this agent.</p>
          <p className="text-sm text-zinc-600">The cron job runs periodically. Posts will appear here.</p>
        </div>
      )}
      
      {!inputAgentId && !feed.length && (
         <div className="flex flex-col items-center justify-center py-32 text-zinc-500 gap-4 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 flex items-center justify-center border border-zinc-800 shadow-xl">
            <Rss className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-lg font-medium text-zinc-400">Enter an Agent ID to view its feed</p>
        </div>
      )}

      <div className="space-y-6">
        {feed.map((post, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            key={post.id || idx}
            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 md:p-8 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-200">Agent {(post.agentId || inputAgentId)?.substring(0, 12)}...</h3>
                <p className="text-xs text-zinc-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
              {post.text}
            </p>
            
            <div className="mt-6 pt-6 border-t border-zinc-800/60 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Rationale</h4>
                <p className="text-sm text-zinc-400 italic bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                  "{post.rationale}"
                </p>
              </div>
              
              {post.sources && post.sources.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Source Reference</h4>
                  <a 
                    href={post.sources[0]} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors border border-blue-500/20"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="truncate max-w-[300px] md:max-w-md">{post.sources[0]}</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

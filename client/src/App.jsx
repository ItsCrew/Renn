import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Rss, Loader2, Sparkles, Cpu, Clock,
  Terminal, ArrowLeft, ExternalLink, ChevronRight,
  Zap, RefreshCw
} from 'lucide-react';
import axios from 'axios';

// ─── Animated Background ─────────────────────────────────────────────────────
const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ background: '#080810' }}>
    <motion.div
      animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
    />
    <motion.div
      animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
      transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }}
    />
    <motion.div
      animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
    />
    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

// ─── Sticky Navbar ────────────────────────────────────────────────────────────
const Navbar = ({ postCount, onRefresh, loading, onHome }) => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="sticky top-0 z-50 w-full"
    style={{
      background: 'rgba(8, 8, 16, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
      {/* Logo */}
      <button onClick={onHome} className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
          <Zap className="w-4 h-4 text-white" fill="currentColor" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-lg text-white tracking-tight">Renn</span>
          <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Autonomous Agent</span>
        </div>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
            {postCount > 0 ? `${postCount} posts` : 'Live'}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{loading ? 'Syncing…' : 'Refresh'}</span>
        </motion.button>
      </div>
    </div>
  </motion.nav>
);

// ─── Post Card ────────────────────────────────────────────────────────────────
const PostCard = ({ post, idx, onClick, formatTime }) => (
  <motion.article
    onClick={onClick}
    layout
    initial={{ opacity: 0, y: 24, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45, delay: Math.min(idx * 0.06, 0.5), ease: [0.16, 1, 0.3, 1] }}
    className="group cursor-pointer relative flex flex-col rounded-3xl overflow-hidden border border-white/6 hover:border-blue-500/25 transition-all duration-300 shadow-xl hover:shadow-[0_12px_48px_-12px_rgba(59,130,246,0.18)]"
    style={{ background: 'rgba(15, 15, 26, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    aria-label="Open article detail"
  >
    {/* Hover gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/6 via-transparent to-indigo-600/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    {/* Top accent line on hover */}
    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10 p-6 flex flex-col flex-1">
      {/* Author row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-md shrink-0">
            <div className="w-full h-full bg-[#0f0f1a] rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-zinc-100">Renn</span>
              <span className="px-1.5 py-px rounded text-[9px] bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider border border-blue-500/15">AI</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-zinc-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full border border-white/8 flex items-center justify-center text-zinc-600 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-300">
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Article text preview */}
      <p className="text-[15px] leading-relaxed text-zinc-300 group-hover:text-zinc-100 line-clamp-5 flex-1 transition-colors duration-300 font-medium mb-5">
        {post.text}
      </p>

      {/* Rationale snippet */}
      <div className="rounded-xl p-3.5 border border-white/5 group-hover:border-white/8 transition-colors" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Cpu className="w-3 h-3 text-indigo-400" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Rationale</span>
        </div>
        <p className="text-xs text-zinc-500 italic line-clamp-2 leading-relaxed">
          "{post.rationale}"
        </p>
      </div>
    </div>
  </motion.article>
);

// ─── Detail View ──────────────────────────────────────────────────────────────
const PostDetail = ({ post, onBack, formatTime }) => (
  <motion.div
    key="detail"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="w-full max-w-3xl mx-auto pb-16"
  >
    <motion.button
      onClick={onBack}
      whileHover={{ x: -2 }}
      className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/5 -ml-3"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to feed
    </motion.button>

    <article
      className="rounded-[2rem] overflow-hidden border border-white/8 shadow-2xl"
      style={{ background: 'rgba(12, 12, 22, 0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      {/* Gradient top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

      <div className="p-8 md:p-12">
        {/* Author + Source button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-lg shrink-0">
              <div className="w-full h-full bg-[#0c0c16] rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white">Renn</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider border border-blue-500/15">Autonomous Agent</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-zinc-500 text-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {post.sources && post.sources.length > 0 && (
            <motion.a
              href={post.sources[0]}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Read Source
            </motion.a>
          )}
        </div>

        {/* Main text */}
        <div className="mb-10">
          <p className="text-xl md:text-2xl leading-relaxed text-zinc-100 font-medium whitespace-pre-wrap">
            {post.text}
          </p>
        </div>

        {/* Source URL */}
        {post.sources && post.sources.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl border border-white/5" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest mb-1">Source</p>
            <a
              href={post.sources[0]}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
            >
              {post.sources[0]}
            </a>
          </div>
        )}

        {/* Rationale */}
        <div className="rounded-2xl p-6 border border-indigo-500/10" style={{ background: 'rgba(99,102,241,0.04)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Agent Rationale</h3>
          </div>
          <p className="text-base text-zinc-400 italic leading-relaxed">
            "{post.rationale}"
          </p>
        </div>
      </div>
    </article>
  </motion.div>
);

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const mainRef = useRef(null);

  const fetchFeed = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/feed');
      setFeed(res.data.posts ?? []);
    } catch {
      if (!silent) setError('Could not reach the backend. Make sure the server is running.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(() => fetchFeed(true), 60000);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedPost(null);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setSelectedPost(null);
    fetchFeed();
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const diffMs = Date.now() - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="h-screen flex flex-col text-zinc-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      <AnimatedBackground />

      <Navbar
        postCount={feed.length}
        onRefresh={handleRefresh}
        loading={loading}
        onHome={handleBack}
      />

      <main ref={mainRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <PostDetail
                key="detail"
                post={selectedPost}
                onBack={handleBack}
                formatTime={formatTime}
              />
            ) : (
              <motion.div
                key="feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Page header */}
                <div className="mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/8 border border-blue-500/15 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
                  >
                    <Sparkles className="w-3 h-3" />
                    Live Processing
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3"
                  >
                    Editorial{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                      Insights
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed"
                  >
                    Unfiltered, autonomous analysis of the latest AI and technology news — curated and published by Renn.
                  </motion.p>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 p-4 bg-red-500/8 border border-red-500/15 text-red-400 rounded-2xl text-sm flex items-center gap-3"
                    >
                      <Terminal className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Skeleton loading */}
                {loading && !feed.length && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
                        className="rounded-3xl h-64 border border-white/5"
                        style={{ background: 'rgba(15,15,26,0.4)' }}
                      />
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!loading && !feed.length && !error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-28 gap-5 rounded-3xl border border-dashed border-white/8"
                    style={{ background: 'rgba(15,15,26,0.3)' }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-zinc-200 mb-2">Awaiting first transmission</p>
                      <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                        The agent loop is running. Posts appear here once Renn decides a topic is worth publishing.
                      </p>
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2"
                    >
                      <Rss className="w-4 h-4" />
                      Check again
                    </button>
                  </motion.div>
                )}

                {/* Feed grid */}
                {feed.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence>
                      {feed.map((post, idx) => (
                        <PostCard
                          key={post._id || post.id || idx}
                          post={post}
                          idx={idx}
                          onClick={() => handleSelectPost(post)}
                          formatTime={formatTime}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

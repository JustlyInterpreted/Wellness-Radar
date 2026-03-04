import React, { useState, useEffect } from 'react';
import { Trend } from './types';
import { detectTrends } from './services/geminiService';
import { TrendCard } from './components/TrendCard';
import { TrendModal } from './components/TrendModal';
import { Radar, RefreshCw, Search, Filter, ArrowUpRight, Activity, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [filter, setFilter] = useState('All');

  const fetchTrends = async () => {
    try {
      const res = await fetch('/api/trends');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTrends(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch trends", err);
      setTrends([]);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleScan = async () => {
    setLoading(true);
    try {
      const newTrends = await detectTrends();
      if (!newTrends || !Array.isArray(newTrends)) {
        throw new Error("No trends detected or invalid response from AI");
      }
      // Save each trend to backend
      for (const trend of newTrends) {
        try {
          const res = await fetch('/api/trends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trend),
          });
          if (!res.ok) throw new Error(`Failed to save trend: ${res.statusText}`);
        } catch (saveErr) {
          console.error("Error saving trend:", saveErr);
        }
      }
      await fetchTrends();
    } catch (error) {
      console.error("Scan failed", error);
      alert("Trend scan failed. This could be due to API limits or network issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(trends.map(t => t.category))];
  const filteredTrends = filter === 'All' ? trends : trends.filter(t => t.category === filter);

  return (
    <div className="min-h-screen radar-grid pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <Radar size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Wellness Radar</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Next Big Product AI</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleScan}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-white font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-brand-dark/10"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Zap size={18} className="text-brand-primary" />
              )}
              {loading ? 'Scanning Signals...' : 'Run Trend Scan'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-100">
            <Activity size={12} />
            Live Market Intelligence • India
          </div>
          <h2 className="text-5xl sm:text-7xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Predict the <span className="text-brand-primary">Next ₹50Cr+</span> Opportunity.
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            Our AI monitors Google Trends, Reddit, and research signals to identify wellness trends 6 months before they hit the mainstream.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex-shrink-0 p-2 rounded-lg bg-slate-100 text-slate-400">
            <Filter size={18} />
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trends Grid */}
        {trends.length === 0 && !loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No trends detected yet</h3>
            <p className="text-slate-500 mb-8">Run your first scan to identify emerging wellness opportunities in India.</p>
            <button 
              onClick={handleScan}
              className="px-8 py-4 rounded-full bg-brand-primary text-white font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-brand-primary/20"
            >
              Start Initial Scan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTrends.map(trend => (
                <TrendCard 
                  key={trend.id} 
                  trend={trend} 
                  onClick={setSelectedTrend} 
                />
              ))}
            </AnimatePresence>
            
            {loading && (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                    <div className="h-4 w-20 bg-slate-200 rounded mb-4" />
                    <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
                    <div className="h-20 w-full bg-slate-100 rounded mb-6" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-12 bg-slate-100 rounded-xl" />
                      <div className="h-12 bg-slate-100 rounded-xl" />
                      <div className="h-12 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium mb-4">
            <ShieldAlert size={16} />
            Data sourced from Google Trends, Reddit, and FSSAI Regulatory signals.
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
            © 2026 Wellness Radar AI • Built for Founders
          </p>
        </div>
      </footer>

      <TrendModal 
        trend={selectedTrend} 
        onClose={() => setSelectedTrend(null)} 
      />
    </div>
  );
}

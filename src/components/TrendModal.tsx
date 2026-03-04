import React from 'react';
import { Trend } from '../types';
import { X, TrendingUp, Target, ShieldAlert, Clock, Lightbulb, BarChart3, Info, Zap, Activity, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrendModalProps {
  trend: Trend | null;
  onClose: () => void;
}

export const TrendModal: React.FC<TrendModalProps> = ({ trend, onClose }) => {
  if (!trend) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          layoutId={trend.id}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
                {trend.category}
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {trend.title}
              </h2>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  Mainstream in {trend.time_to_mainstream}
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div>Detected {new Date(trend.created_at || Date.now()).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Velocity</span>
                </div>
                <div className="text-xl font-bold text-slate-900">{trend.velocity}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Target size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Potential</span>
                </div>
                <div className="text-xl font-bold text-slate-900">{trend.market_value}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                  <ShieldAlert size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Comp.</span>
                </div>
                <div className="text-xl font-bold text-slate-900">{trend.competition_intensity}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                  <BarChart3 size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Seasonality</span>
                </div>
                <div className="text-xl font-bold text-slate-900">{trend.seasonality_score}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-pink-600 mb-1">
                  <Zap size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Influencer</span>
                </div>
                <div className="text-xl font-bold text-slate-900">{trend.influencer_score}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-violet-600 mb-1">
                  <Activity size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sentiment</span>
                </div>
                <div className="text-xl font-bold text-slate-900">{trend.sentiment_score}%</div>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-2 mb-4 text-slate-900">
                  <Info size={20} className="text-brand-primary" />
                  <h3 className="text-xl font-bold">The Signal</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {trend.summary}
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trend.signals.map((signal, idx) => (
                    <div key={idx} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-brand-primary font-bold text-[10px]">
                        {signal.source.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{signal.source}</div>
                        <div className="text-sm text-slate-700 font-medium">{signal.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-8 rounded-3xl bg-brand-dark text-white shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb size={24} className="text-brand-primary" />
                  <h3 className="text-2xl font-bold text-white">Founder's Opportunity Brief</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3">Concrete Product Ideas</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {trend.product_ideas.map((idea, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                          <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-brand-primary">{idx + 1}</span>
                          </div>
                          <span className="text-sm text-emerald-50/90">{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3">Target Audience</h4>
                      <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Demographics</div>
                          <div className="text-sm text-emerald-50/90">{trend.target_audience.demographics}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Psychographics</div>
                          <div className="text-sm text-emerald-50/90">{trend.target_audience.psychographics}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3">Marketing Angles</h4>
                      <ul className="space-y-2">
                        {trend.marketing_angles.map((angle, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-emerald-50/90">
                            <ArrowUpRight size={14} className="text-brand-primary" />
                            {angle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6 text-slate-900">
                  <BarChart3 size={20} className="text-brand-primary" />
                  <h3 className="text-xl font-bold">Market Landscape & Competitors</h3>
                </div>
                <div className="space-y-4">
                  {trend.competitors.map((comp, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-brand-primary/30 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-lg font-bold text-slate-900">{comp.name}</h5>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${comp.location === 'India' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {comp.location}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">{comp.product}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Funding / Status</div>
                          <div className="text-sm font-bold text-slate-700">{comp.funding || 'Unknown'}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Differentiation</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{comp.differentiation}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Revenue</div>
                            <p className="text-xs font-bold text-slate-700">{comp.revenue || 'N/A'}</p>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">EBITDA</div>
                            <p className="text-xs font-bold text-slate-700">{comp.ebitda || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React from 'react';
import { Trend } from '../types';
import { TrendingUp, Target, ShieldAlert, Clock, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface TrendCardProps {
  trend: Trend;
  onClick: (trend: Trend) => void;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend, onClick }) => {
  const getScoreColor = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 30) return 'text-emerald-600 bg-emerald-50';
      if (score < 70) return 'text-amber-600 bg-amber-50';
      return 'text-rose-600 bg-rose-50';
    }
    if (score > 70) return 'text-emerald-600 bg-emerald-50';
    if (score > 30) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <motion.div
      layoutId={trend.id}
      onClick={() => onClick(trend)}
      className="glass-card rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-brand-primary group"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
            {trend.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
            {trend.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <Clock size={12} />
          {trend.time_to_mainstream}
        </div>
      </div>

      <p className="text-slate-600 text-sm line-clamp-2 mb-6">
        {trend.summary}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center p-2 rounded-xl mb-1 ${getScoreColor(trend.velocity)}`}>
            <TrendingUp size={16} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Velocity</div>
          <div className="text-sm font-bold">{trend.velocity}%</div>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center p-2 rounded-xl mb-1 ${getScoreColor(trend.market_potential)}`}>
            <Target size={16} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Potential</div>
          <div className="text-sm font-bold">{trend.market_value}</div>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center p-2 rounded-xl mb-1 ${getScoreColor(trend.influencer_score)}`}>
            <Zap size={16} />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Influencer</div>
          <div className="text-sm font-bold">{trend.influencer_score}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-brand-primary font-bold text-xs uppercase tracking-wider">
        <span>View Opportunity Brief</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

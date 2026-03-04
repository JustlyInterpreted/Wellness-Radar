export interface TrendSignal {
  source: 'Google Trends' | 'Reddit' | 'YouTube' | 'Research' | 'Regulatory';
  description: string;
  link?: string;
}

export interface Competitor {
  name: string;
  product: string;
  differentiation: string;
  revenue?: string;
  ebitda?: string;
  funding?: string;
  location: 'India' | 'US';
}

export interface Trend {
  id: string;
  title: string;
  category: string;
  velocity: number; // 0-100
  market_potential: number; // 0-100
  market_value: string; // e.g., "₹50Cr+"
  competition_intensity: number; // 0-100
  seasonality_score: number; // 0-100
  influencer_score: number; // 0-100
  sentiment_score: number; // 0-100
  time_to_mainstream: string;
  summary: string;
  opportunity_brief: string;
  product_ideas: string[];
  target_audience: {
    demographics: string;
    psychographics: string;
  };
  marketing_angles: string[];
  competitors: Competitor[];
  signals: TrendSignal[];
  created_at?: string;
}

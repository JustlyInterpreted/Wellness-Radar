import { GoogleGenAI, Type } from "@google/genai";
import { Trend } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function detectTrends(): Promise<Trend[]> {
  const prompt = `
    Act as a world-class market research analyst specializing in the Indian wellness and health D2C market.
    Your task is to identify 5-10 emerging wellness trends in India that are currently in the "early signal" phase (3-6 months before mainstream adoption).
    
    For each trend, you MUST provide a comprehensive, data-rich "Founder's Opportunity Brief".
    
    SCORING SYSTEM (0-100):
    - Velocity: Speed of growth in search/social interest.
    - Market Potential Score: A score from 0-100 representing the overall attractiveness of the market.
    - Competition Intensity: How saturated the market is with branded players.
    - Seasonality Score: 0 = Evergreen, 100 = Highly Seasonal.
    - Influencer Score: 0 = No mentions, 100 = Viral among top health influencers.
    - Sentiment Score: 0 = Negative/Controversial, 100 = Extremely Positive/Aspirational.

    DETAILED BRIEF REQUIREMENTS:
    1. Market Value: A string representing the estimated ₹ value of the opportunity (e.g., "₹50Cr+", "₹120Cr+").
    2. Product Ideas: Suggest 2-3 concrete, launch-ready product or service ideas...
    2. Target Audience: 
       - Demographics: Age, location (Tier 1/2), income level.
       - Psychographics: Values, pain points, lifestyle habits (e.g., "Biohackers looking for sleep optimization").
    3. Marketing Angles: 3 specific messaging hooks and marketing channels (e.g., "Focus on 'Zero-Sugar' on Instagram Reels", "Partner with yoga studios for...").
    4. Deep Competitor Analysis (CRITICAL):
       - Find the top 2-3 players.
       - If they exist in INDIA: Provide Name, Exact Product, Differentiation, Revenue/EBITDA (estimate if private), Funding status (e.g., "Series A, $5M raised").
       - If NO players in India: You MUST find the top 2-3 players in the UNITED STATES who have proven this model. Provide their Name, Product, Differentiation, and their success metrics (Revenue, Valuation, or Growth).
       - This section must be highly detailed to help a founder understand the "moat" they need to build.

    Return the data as a JSON array of objects matching the specified schema. Use your search tool to find real, up-to-date competitor data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              velocity: { type: Type.INTEGER },
              market_potential: { type: Type.INTEGER },
              market_value: { type: Type.STRING },
              competition_intensity: { type: Type.INTEGER },
              seasonality_score: { type: Type.INTEGER },
              influencer_score: { type: Type.INTEGER },
              sentiment_score: { type: Type.INTEGER },
              time_to_mainstream: { type: Type.STRING },
              summary: { type: Type.STRING },
              opportunity_brief: { type: Type.STRING },
              product_ideas: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              target_audience: {
                type: Type.OBJECT,
                properties: {
                  demographics: { type: Type.STRING },
                  psychographics: { type: Type.STRING }
                },
                required: ["demographics", "psychographics"]
              },
              marketing_angles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              competitors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    product: { type: Type.STRING },
                    differentiation: { type: Type.STRING },
                    revenue: { type: Type.STRING },
                    ebitda: { type: Type.STRING },
                    funding: { type: Type.STRING },
                    location: { type: Type.STRING, enum: ["India", "US"] }
                  },
                  required: ["name", "product", "differentiation", "location"]
                }
              },
              signals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["source", "description"]
                }
              }
            },
            required: [
              "id", "title", "category", "velocity", "market_potential", "market_value",
              "competition_intensity", "seasonality_score", "influencer_score", 
              "sentiment_score", "time_to_mainstream", "summary", "opportunity_brief",
              "product_ideas", "target_audience", "marketing_angles", "competitors", "signals"
            ]
          }
        },
        tools: [{ googleSearch: {} }]
      },
    });

    const text = response.text;
    if (!text) return [];
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", text);
      return [];
    }
  } catch (error) {
    console.error("Error detecting trends:", error);
    return [];
  }
}

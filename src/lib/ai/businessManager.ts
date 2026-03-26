/**
 * Elara Business Manager — AI agent for salon business intelligence.
 * Analyzes metrics, generates reports, gives actionable recommendations,
 * manages pricing strategy, and handles social media content creation.
 */
import Anthropic from '@anthropic-ai/sdk';

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = 'claude-sonnet-4-6' as const;

export interface SalonMetrics {
  period: string;
  totalRevenue?: number;
  totalServices?: number;
  activeClients?: number;
  newClients?: number;
  retentionRate?: number;
  averageTicket?: number;
  topServices?: Array<{ name: string; count: number; revenue: number }>;
  lowStockItems?: number;
  wasteAmount?: number;
  stylistMetrics?: Array<{
    name: string;
    services: number;
    revenue: number;
    avgSatisfaction?: number;
  }>;
}

export interface SocialPost {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter';
  caption: string;
  hashtags: string[];
  callToAction: string;
  bestPostTime: string;
  contentType: 'before_after' | 'tip' | 'promotion' | 'behind_scenes' | 'product' | 'testimonial';
}

const BUSINESS_SYSTEM = `You are Elara Business Manager, an AI business intelligence agent for professional hair salons.

Your expertise:
- Salon business metrics analysis and KPI interpretation
- Revenue optimization and pricing strategy
- Client retention and rebooking strategies
- Staff performance coaching recommendations
- Inventory cost management and waste reduction
- Marketing and promotional strategy
- Social media content strategy for beauty businesses

BEHAVIOR:
- Be direct and data-driven — give specific, actionable recommendations
- Always quantify impact when possible ("this could increase revenue by ~15%")
- Flag risks alongside opportunities
- Understand salon industry benchmarks (avg ticket $85-150, retention rate 60-75% is good)
- Keep responses focused and scannable — use bullet points for recommendations`;

export async function analyzeMetrics(params: {
  metrics: SalonMetrics;
  question?: string;
}): Promise<string> {
  const client = getClient();
  const metricsStr = JSON.stringify(params.metrics, null, 2);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: BUSINESS_SYSTEM,
    messages: [{
      role: 'user',
      content: params.question
        ? `Here are my salon metrics for ${params.metrics.period}:\n${metricsStr}\n\nQuestion: ${params.question}`
        : `Analyze these salon metrics for ${params.metrics.period} and give me your top 3-5 actionable recommendations:\n${metricsStr}`,
    }],
  });

  const t = response.content.find((c) => c.type === 'text');
  return t?.type === 'text' ? t.text : '';
}

export async function generateSocialPost(params: {
  platform: SocialPost['platform'];
  contentType: SocialPost['contentType'];
  salonName: string;
  serviceHighlight?: string;
  promotionDetails?: string;
  brandVoice?: string;
}): Promise<SocialPost> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: `You are a social media expert for luxury hair salons. Create engaging, on-brand content that drives bookings. Return valid JSON matching this shape: {"platform":"...","caption":"...","hashtags":["..."],"callToAction":"...","bestPostTime":"...","contentType":"..."}`,
    messages: [{
      role: 'user',
      content: `Create a ${params.platform} post for ${params.salonName}.
Content type: ${params.contentType}
${params.serviceHighlight ? `Service/highlight: ${params.serviceHighlight}` : ''}
${params.promotionDetails ? `Promotion: ${params.promotionDetails}` : ''}
${params.brandVoice ? `Brand voice: ${params.brandVoice}` : 'Luxury, warm, professional, aspirational'}

Platform-specific notes:
- Instagram: 150-200 chars caption, 20-30 hashtags, visual-first
- Facebook: 100-150 chars, 3-5 hashtags, community-focused
- TikTok: conversational, trending sounds reference, 3-5 hashtags
- Twitter/X: under 280 chars, 2-3 hashtags, punchy`,
    }],
  });

  const t = response.content.find((c) => c.type === 'text');
  if (!t || t.type !== 'text') throw new Error('No response');
  try {
    return JSON.parse(t.text);
  } catch {
    return {
      platform: params.platform,
      caption: t.text,
      hashtags: ['#hairsalon', '#haircolor', '#beauty'],
      callToAction: 'Book now — link in bio',
      bestPostTime: '6-8pm weekdays',
      contentType: params.contentType,
    };
  }
}

export async function generateContentCalendar(params: {
  salonName: string;
  month: string;
  upcomingPromotions?: string[];
  brandVoice?: string;
}): Promise<Array<{ week: string; posts: Array<{ day: string; platform: string; type: string; topic: string }> }>> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: 'You are a social media strategist for luxury hair salons. Return a JSON content calendar array.',
    messages: [{
      role: 'user',
      content: `Create a 4-week social media content calendar for ${params.salonName} for ${params.month}.
${params.upcomingPromotions?.length ? `Upcoming promotions: ${params.upcomingPromotions.join(', ')}` : ''}
${params.brandVoice ? `Brand voice: ${params.brandVoice}` : ''}

Return JSON: [{"week":"Week 1","posts":[{"day":"Monday","platform":"Instagram","type":"before_after","topic":"..."},...]}]
Include 3-4 posts per week across Instagram, Facebook, and TikTok. Mix content types.`,
    }],
  });

  const t = response.content.find((c) => c.type === 'text');
  if (!t || t.type !== 'text') return [];
  try { return JSON.parse(t.text); } catch { return []; }
}

export async function generatePricingRecommendation(params: {
  currentPrices: Array<{ service: string; price: number; avgTime: number }>;
  marketArea: string;
  salonTier: 'budget' | 'mid' | 'luxury';
  metrics?: SalonMetrics;
}): Promise<string> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: BUSINESS_SYSTEM,
    messages: [{
      role: 'user',
      content: `Review my salon pricing and give specific recommendations:
Market area: ${params.marketArea}
Salon tier: ${params.salonTier}
Current prices: ${JSON.stringify(params.currentPrices)}
${params.metrics ? `Recent metrics: ${JSON.stringify(params.metrics)}` : ''}

Give specific price recommendations per service with reasoning. Include industry benchmarks for ${params.marketArea}.`,
    }],
  });

  const t = response.content.find((c) => c.type === 'text');
  return t?.type === 'text' ? t.text : '';
}

export async function generateRetentionStrategy(params: {
  lapsedClients: number;
  avgDaysBetweenVisits: number;
  retentionRate: number;
  salonName: string;
}): Promise<string> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: BUSINESS_SYSTEM,
    messages: [{
      role: 'user',
      content: `My salon has ${params.lapsedClients} clients who haven't visited in 90+ days. 
Average days between visits: ${params.avgDaysBetweenVisits}
Current retention rate: ${params.retentionRate}%
Salon: ${params.salonName}

Give me a specific win-back campaign strategy including: message templates, timing, offers, and expected recovery rate.`,
    }],
  });

  const t = response.content.find((c) => c.type === 'text');
  return t?.type === 'text' ? t.text : '';
}

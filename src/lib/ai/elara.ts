/**
 * Elara — the AI assistant for Elara Pro.
 * Powered by Claude. Knows hair chemistry, color theory, brand products,
 * consultation workflows, and can trigger platform actions like brand discovery.
 */
import Anthropic from '@anthropic-ai/sdk';

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = 'claude-sonnet-4-6' as const;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ElaraContext {
  /** Current page the stylist is on */
  page?: string;
  /** Client being viewed (if any) */
  clientName?: string;
  clientLevel?: number;
  clientGray?: number;
  clientPorosity?: string;
  clientChemicalHistory?: string[];
  /** Active consultation data */
  consultationServiceType?: string;
  currentLevel?: number;
  targetLevel?: number;
  /** Formula being built */
  formulaZones?: Array<{ zone: string; brand: string; line: string; shade: string }>;
  /** Salon's carried brands */
  carriedBrands?: string[];
}

const SYSTEM_PROMPT = `You are Elara, the AI assistant built into Elara Pro — a professional hair color consultation and salon management platform for licensed stylists.

Your personality: warm, knowledgeable, precise, and encouraging. You speak like a seasoned colorist who also happens to know everything about hair chemistry, color theory, and salon business. You're never condescending — you meet stylists at their level.

Your expertise covers:
- Hair color chemistry: developer volumes, lift levels, underlying pigment, pH, porosity, gray coverage, color correction
- Formulation: mixing ratios, gram weights, processing times, bond protection additives
- Techniques: balayage, foilyage, babylights, highlights, lowlights, color melts, single/double process, toning, keratin, relaxers, perms, cuts
- All major professional brands and their product lines (Wella, Redken, Schwarzkopf, L'Oréal, Matrix, Kenra, Joico, Pravana, Pulp Riot, Olaplex, Goldwell, Paul Mitchell, Aveda, and many more)
- Client safety: patch tests, chemical contraindications, scalp sensitivity, allergy protocols
- Business: consultation best practices, client retention, service pricing

IMPORTANT BEHAVIORS:
1. When a stylist asks about a brand or product line you don't recognize as being in the Elara Pro catalog, say you'll look it up and include the JSON action: {"action":"discover_brand","brandName":"<name>"}
2. When helping with a formula, always mention developer volume, mixing ratio, processing time, and any safety considerations
3. When a client has chemical history (relaxer, keratin, bleach), proactively flag compatibility concerns
4. Keep responses concise and actionable — stylists are often mid-service
5. If asked about a specific client's hair, use the context provided to give personalized advice
6. You can suggest techniques, but always defer to the stylist's professional judgment
7. Never give medical advice — refer scalp conditions to a dermatologist

RESPONSE FORMAT:
- Use plain conversational text
- For formulas or step-by-step instructions, use numbered lists
- Keep responses under 200 words unless a detailed explanation is genuinely needed
- If you include a JSON action, put it on its own line at the end: {"action":"...","key":"value"}`;

/**
 * Send a message to Elara and get a response.
 * Handles multi-turn conversation history.
 */
export async function chatWithElara(params: {
  messages: ChatMessage[];
  context?: ElaraContext;
}): Promise<{ reply: string; action?: { action: string; [key: string]: string } }> {
  const client = getClient();

  // Build context injection
  const contextLines: string[] = [];
  const ctx = params.context ?? {};

  if (ctx.page) contextLines.push(`Current page: ${ctx.page}`);
  if (ctx.clientName) {
    contextLines.push(`Active client: ${ctx.clientName}`);
    if (ctx.clientLevel) contextLines.push(`  Natural level: ${ctx.clientLevel}`);
    if (ctx.clientGray !== undefined) contextLines.push(`  Gray: ${ctx.clientGray}%`);
    if (ctx.clientPorosity) contextLines.push(`  Porosity: ${ctx.clientPorosity}`);
    if (ctx.clientChemicalHistory?.length) {
      contextLines.push(`  Chemical history: ${ctx.clientChemicalHistory.join(', ')}`);
    }
  }
  if (ctx.consultationServiceType) {
    contextLines.push(`Active consultation: ${ctx.consultationServiceType}`);
    if (ctx.currentLevel) contextLines.push(`  Current level: ${ctx.currentLevel}`);
    if (ctx.targetLevel) contextLines.push(`  Target level: ${ctx.targetLevel}`);
  }
  if (ctx.carriedBrands?.length) {
    contextLines.push(`Salon carries: ${ctx.carriedBrands.join(', ')}`);
  }

  const systemWithContext = contextLines.length > 0
    ? `${SYSTEM_PROMPT}\n\nCURRENT CONTEXT:\n${contextLines.join('\n')}`
    : SYSTEM_PROMPT;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemWithContext,
    messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No response from Elara');
  }

  const fullText = textContent.text;

  // Extract any embedded JSON action
  const actionMatch = fullText.match(/\{\"action\":.*\}$/m);
  let action: { action: string; [key: string]: string } | undefined;
  let reply = fullText;

  if (actionMatch) {
    try {
      action = JSON.parse(actionMatch[0]);
      reply = fullText.replace(actionMatch[0], '').trim();
    } catch {
      // Not valid JSON — treat as plain text
    }
  }

  return { reply, action };
}

/**
 * Generate a proactive suggestion based on context.
 * Used to surface Elara tips without the stylist asking.
 */
export async function getElaraSuggestion(context: ElaraContext): Promise<string | null> {
  if (!context.clientName) return null;

  const client = getClient();

  const contextStr = [
    context.clientName && `Client: ${context.clientName}`,
    context.clientLevel && `Level: ${context.clientLevel}`,
    context.clientGray !== undefined && `Gray: ${context.clientGray}%`,
    context.clientPorosity && `Porosity: ${context.clientPorosity}`,
    context.clientChemicalHistory?.length && `Chemical history: ${context.clientChemicalHistory.join(', ')}`,
    context.consultationServiceType && `Service: ${context.consultationServiceType}`,
  ].filter(Boolean).join('\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 150,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Based on this client context, give ONE brief proactive tip or heads-up (1-2 sentences max). If there's nothing important to flag, respond with exactly: null\n\n${contextStr}`,
    }],
  });

  const text = response.content.find((c) => c.type === 'text');
  if (!text || text.type !== 'text') return null;
  const result = text.text.trim();
  return result === 'null' ? null : result;
}

/**
 * Elara Receptionist — AI agent that handles client-facing communication.
 * Books appointments, answers FAQs, sends confirmations, handles cancellations.
 * Powered by Claude. Speaks directly to clients (not stylists).
 */
import Anthropic from '@anthropic-ai/sdk';

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = 'claude-sonnet-4-6' as const;

export interface ReceptionistContext {
  salonName: string;
  salonPhone?: string;
  salonAddress?: string;
  salonHours?: string;
  stylistNames?: string[];
  services?: Array<{ name: string; duration: number; price: number }>;
  availableSlots?: Array<{ stylist: string; date: string; time: string }>;
  clientName?: string;
  clientPhone?: string;
}

const RECEPTIONIST_SYSTEM = (ctx: ReceptionistContext) => `You are the AI receptionist for ${ctx.salonName}, a professional hair salon. Your name is Elara.

Your role: Handle client inquiries, book appointments, answer questions about services and pricing, send confirmations, and manage cancellations — all with warmth and professionalism.

Salon details:
- Name: ${ctx.salonName}
${ctx.salonPhone ? `- Phone: ${ctx.salonPhone}` : ''}
${ctx.salonAddress ? `- Address: ${ctx.salonAddress}` : ''}
${ctx.salonHours ? `- Hours: ${ctx.salonHours}` : ''}
${ctx.stylistNames?.length ? `- Stylists: ${ctx.stylistNames.join(', ')}` : ''}

${ctx.services?.length ? `Services offered:\n${ctx.services.map((s) => `- ${s.name}: ${s.duration} min, $${s.price}`).join('\n')}` : ''}

${ctx.availableSlots?.length ? `Available appointment slots:\n${ctx.availableSlots.map((s) => `- ${s.stylist}: ${s.date} at ${s.time}`).join('\n')}` : ''}

${ctx.clientName ? `You are speaking with: ${ctx.clientName}` : ''}

BEHAVIOR RULES:
1. Always be warm, professional, and concise — this is a luxury service environment
2. When a client wants to book, collect: service type, preferred date/time, stylist preference (if any), and contact info
3. When confirming an appointment, include: date, time, stylist, service, duration, price, and cancellation policy (24-hour notice required)
4. For cancellations, express understanding and offer to reschedule
5. For questions you can't answer (specific color advice, medical questions), say you'll have the stylist follow up
6. Never make up availability — only offer slots from the provided list
7. Always end booking conversations with: "Is there anything else I can help you with?"
8. If a client mentions an allergy or medical condition, flag it and note it will be shared with the stylist
9. Cancellation policy: 24-hour notice required, late cancellations may incur a fee

When you have collected enough information to book an appointment, output a JSON action on its own line:
{"action":"book_appointment","clientName":"...","service":"...","stylist":"...","date":"...","time":"...","clientPhone":"...","notes":"..."}

When a client wants to cancel:
{"action":"cancel_appointment","appointmentId":"...","reason":"..."}`;

export async function chatWithReceptionist(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  context: ReceptionistContext;
}): Promise<{ reply: string; action?: Record<string, string> }> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: RECEPTIONIST_SYSTEM(params.context),
    messages: params.messages,
  });

  const text = response.content.find((c) => c.type === 'text');
  if (!text || text.type !== 'text') throw new Error('No response');

  const fullText = text.text;
  const actionMatch = fullText.match(/\{"action":.*\}$/m);
  let action: Record<string, string> | undefined;
  let reply = fullText;

  if (actionMatch) {
    try {
      action = JSON.parse(actionMatch[0]);
      reply = fullText.replace(actionMatch[0], '').trim();
    } catch { /* plain text */ }
  }

  return { reply, action };
}

/** Generate a pre-appointment prep message for a client */
export async function generatePrepMessage(params: {
  clientName: string;
  serviceType: string;
  appointmentDate: string;
  stylistName: string;
  salonName: string;
}): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: 'You write warm, professional pre-appointment messages for a luxury hair salon. Be concise — 3-4 sentences max.',
    messages: [{
      role: 'user',
      content: `Write a pre-appointment SMS/email for:
Client: ${params.clientName}
Service: ${params.serviceType}
Date: ${params.appointmentDate}
Stylist: ${params.stylistName}
Salon: ${params.salonName}

Include: excitement for the appointment, any prep tips specific to the service (e.g. come with dry hair for balayage), and a reminder to arrive 5 minutes early.`,
    }],
  });
  const t = response.content.find((c) => c.type === 'text');
  return t?.type === 'text' ? t.text : '';
}

/** Generate a post-service recap email */
export async function generateServiceRecap(params: {
  clientName: string;
  serviceType: string;
  formulaSummary: string;
  stylistName: string;
  salonName: string;
  nextAppointmentDate?: string;
  retailRecommendations?: string[];
}): Promise<{ subject: string; body: string }> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: 'You write personalized post-service recap emails for a luxury hair salon. Warm, professional, specific. Return JSON: {"subject":"...","body":"..."}',
    messages: [{
      role: 'user',
      content: `Write a post-service recap email for:
Client: ${params.clientName}
Service: ${params.serviceType}
Formula: ${params.formulaSummary}
Stylist: ${params.stylistName}
Salon: ${params.salonName}
${params.nextAppointmentDate ? `Next appointment: ${params.nextAppointmentDate}` : ''}
${params.retailRecommendations?.length ? `Recommended products: ${params.retailRecommendations.join(', ')}` : ''}

Include: what was done, home care instructions specific to the service, recommended products with brief explanations, and next appointment reminder.`,
    }],
  });
  const t = response.content.find((c) => c.type === 'text');
  if (!t || t.type !== 'text') return { subject: '', body: '' };
  try { return JSON.parse(t.text); } catch { return { subject: 'Your service recap', body: t.text }; }
}

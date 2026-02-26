import Anthropic from '@anthropic-ai/sdk';

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODEL = 'claude-sonnet-4-6' as const;

export interface ParsedConsultation {
  currentLevel: number | null;
  currentTone: string | null;
  targetLevel: number | null;
  targetTone: string | null;
  grayPercentage: number | null;
  hairCondition: string | null;
  porosityLevel: string | null;
  previousChemicals: string[];
  desiredResult: string;
  contraindications: string[];
  additionalNotes: string;
}

export interface ConfidenceResult {
  overallConfidence: number;
  fieldConfidences: Record<string, number>;
  missingFields: string[];
  suggestions: string[];
}

/**
 * Parse messy stylist notes into structured consultation data.
 * This is the ONLY AI-powered parsing in the system.
 * All chemistry/safety decisions are deterministic.
 */
export async function parseConsultationNotes(
  rawNotes: string
): Promise<{ parsed: ParsedConsultation; confidence: ConfidenceResult }> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a hair color consultation parser. Extract structured data from these stylist notes.
Return ONLY valid JSON matching this schema:
{
  "parsed": {
    "currentLevel": number or null (1-10 hair level scale),
    "currentTone": string or null,
    "targetLevel": number or null (1-10),
    "targetTone": string or null,
    "grayPercentage": number or null (0-100),
    "hairCondition": string or null ("good","fair","poor","damaged"),
    "porosityLevel": string or null ("low","medium","high"),
    "previousChemicals": string[] (list of previous chemical services),
    "desiredResult": string (what the client wants),
    "contraindications": string[] (any safety concerns),
    "additionalNotes": string
  },
  "confidence": {
    "overallConfidence": number (0-1),
    "fieldConfidences": { "fieldName": number (0-1) },
    "missingFields": string[],
    "suggestions": string[] (what to ask client for clarity)
  }
}

Stylist notes:
"""
${rawNotes}
"""`,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const result = JSON.parse(textContent.text) as {
    parsed: ParsedConsultation;
    confidence: ConfidenceResult;
  };

  return result;
}

/**
 * Generate a professional narrative summary from consultation data.
 * This is a formatting/writing task only — no safety decisions.
 */
export async function generateNarrative(
  consultation: {
    clientName: string;
    stylistName: string;
    currentLevel: number | null;
    currentTone: string | null;
    targetLevel: number | null;
    targetTone: string | null;
    grayPercentage: number | null;
    hairCondition: string | null;
    formulaSummary: string;
    warnings: string[];
  }
): Promise<string> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Write a concise, professional consultation narrative for a salon record. Use third person, past tense. Include all technical details. Keep it to 2-3 paragraphs.

Client: ${consultation.clientName}
Stylist: ${consultation.stylistName}
Current: Level ${consultation.currentLevel ?? 'unspecified'} ${consultation.currentTone ?? ''}
Target: Level ${consultation.targetLevel ?? 'unspecified'} ${consultation.targetTone ?? ''}
Gray: ${consultation.grayPercentage ?? 'N/A'}%
Hair Condition: ${consultation.hairCondition ?? 'unspecified'}
Formula: ${consultation.formulaSummary}
${consultation.warnings.length > 0 ? `Safety Notes: ${consultation.warnings.join('; ')}` : ''}`,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  return textContent.text;
}

/**
 * Score confidence on an existing consultation's completeness.
 */
export async function scoreConsultationConfidence(
  consultation: Record<string, unknown>
): Promise<ConfidenceResult> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Rate the completeness of this hair color consultation data. Return ONLY valid JSON:
{
  "overallConfidence": number (0-1),
  "fieldConfidences": { "fieldName": number (0-1) },
  "missingFields": string[],
  "suggestions": string[]
}

Consultation data:
${JSON.stringify(consultation, null, 2)}`,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  return JSON.parse(textContent.text) as ConfidenceResult;
}

/**
 * ElevenLabs TTS integration for Elara's voice.
 * Requires ELEVENLABS_API_KEY env var.
 * Voice add-on: $9.99/mo — checked server-side before streaming audio.
 */

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  description: string;
  preview_url: string;
  category: 'elara' | 'professional' | 'warm' | 'energetic';
}

/** Curated voice options shown in Settings → Voice */
export const ELARA_VOICES: ElevenLabsVoice[] = [
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Elara (Default)',
    description: 'Warm, professional, and clear. The default Elara voice.',
    preview_url: 'https://api.elevenlabs.io/v1/voices/EXAVITQu4vr4xnSDxMaL/preview',
    category: 'elara',
  },
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Elara (Soft)',
    description: 'Gentle and soothing — great for consultations.',
    preview_url: 'https://api.elevenlabs.io/v1/voices/pNInz6obpgDQGcFmaJgB/preview',
    category: 'elara',
  },
  {
    voice_id: 'jBpfuIE2acCO8z3wKNLl',
    name: 'Elara (Confident)',
    description: 'Authoritative and precise — ideal for formula readouts.',
    preview_url: 'https://api.elevenlabs.io/v1/voices/jBpfuIE2acCO8z3wKNLl/preview',
    category: 'professional',
  },
  {
    voice_id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Elara (Warm)',
    description: 'Friendly and approachable — perfect for client-facing moments.',
    preview_url: 'https://api.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/preview',
    category: 'warm',
  },
  {
    voice_id: 'z9fAnlkpzviPz146aGWa',
    name: 'Elara (Energetic)',
    description: 'Upbeat and motivating — great for technique school.',
    preview_url: 'https://api.elevenlabs.io/v1/voices/z9fAnlkpzviPz146aGWa/preview',
    category: 'energetic',
  },
];

export const DEFAULT_VOICE_ID = ELARA_VOICES[0]!.voice_id;

/**
 * Stream TTS audio from ElevenLabs.
 * Returns a ReadableStream of audio/mpeg bytes.
 */
export async function streamTTS(params: {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}): Promise<Response> {
  const {
    text,
    voiceId = DEFAULT_VOICE_ID,
    stability = 0.5,
    similarityBoost = 0.75,
  } = params;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: { stability, similarity_boost: similarityBoost },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  return res;
}

/** Get available voices from ElevenLabs API (for dynamic voice list) */
export async function getAvailableVoices(): Promise<ElevenLabsVoice[]> {
  // Return curated list — avoids exposing full ElevenLabs catalog
  return ELARA_VOICES;
}

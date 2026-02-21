import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, parseBody, getAuthContext } from '@/lib/api-helpers';
import { parseNotesSchema } from '@/lib/validators';
import { parseConsultationNotes, generateNarrative, scoreConsultationConfidence } from '@/lib/ai';

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'parse') {
    const parseResult = await parseBody(request, parseNotesSchema);
    if (parseResult.error) return errorResponse(parseResult.error);

    try {
      const aiResult = await parseConsultationNotes(parseResult.data!.rawNotes);
      return jsonResponse(aiResult);
    } catch (err) {
      return errorResponse('AI parsing failed. Please try again.', 500);
    }
  }

  if (action === 'narrative') {
    try {
      const body = await request.json();
      const narrative = await generateNarrative(body);
      return jsonResponse({ narrative });
    } catch (err) {
      return errorResponse('Narrative generation failed.', 500);
    }
  }

  if (action === 'confidence') {
    try {
      const body = await request.json();
      const confidence = await scoreConsultationConfidence(body);
      return jsonResponse(confidence);
    } catch (err) {
      return errorResponse('Confidence scoring failed.', 500);
    }
  }

  return errorResponse('Invalid action. Use ?action=parse|narrative|confidence');
}

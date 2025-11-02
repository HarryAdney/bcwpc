import type { APIRoute } from 'astro';
import { llamaindexService } from '../../lib/llamaindex';

export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      content,
      title,
      type = 'other',
      metadata = {}
    } = await request.json();

    // Validate required fields
    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Content is required and must be a string'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!title || typeof title !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Title is required and must be a string'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const validTypes = ['minutes', 'annual-report', 'newsletter', 'policy', 'other'];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Type must be one of: ${validTypes.join(', ')}`
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await llamaindexService.indexDocument(content, title, type, metadata);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          documentId: result.documentId,
          message: 'Document indexed successfully'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Index document API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error during document indexing'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
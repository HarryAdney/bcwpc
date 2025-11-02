import type { APIRoute } from 'astro';
import { llamaindexService } from '../../lib/llamaindex';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { query, topK = 5 } = await request.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Query is required and must be a string'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await llamaindexService.search(query, topK);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          query,
          results: result.results,
          total: result.results?.length || 0
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
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error during search'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
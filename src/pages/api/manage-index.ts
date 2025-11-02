import type { APIRoute } from 'astro';
import { llamaindexService } from '../../lib/llamaindex';

export const GET: APIRoute = async () => {
  try {
    const documents = llamaindexService.getDocuments();

    return new Response(
      JSON.stringify({
        success: true,
        documents,
        total: documents.length,
        types: documents.reduce((acc, doc) => {
          acc[doc.type] = (acc[doc.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get documents API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to retrieve documents'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action } = await request.json();

    if (action === 'initialize') {
      await llamaindexService.initialize();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Index initialized successfully'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else if (action === 'index-directory') {
      const { dirPath, documentType } = await request.json();

      if (!dirPath || !documentType) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'dirPath and documentType are required for directory indexing'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const result = await llamaindexService.indexDirectory(dirPath, documentType);

      return new Response(
        JSON.stringify({
          success: result.success,
          message: result.message,
          indexed: result.indexed,
          errors: result.errors
        }),
        {
          status: result.success ? 200 : 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unknown action. Supported actions: initialize, index-directory'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Manage index API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error during index management'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
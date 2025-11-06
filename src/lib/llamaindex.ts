import {
  VectorStoreIndex,
  Document,
  SimpleDirectoryReader,
  Settings,
  OpenAI,
  Ollama
} from 'llamaindex';
import fs from 'fs/promises';

interface DocumentMetadata {
  title: string;
  type: 'minutes' | 'annual-report' | 'newsletter' | 'policy' | 'other';
  date?: string;
  path: string;
  size: number;
}

interface SearchResult {
  text: string;
  score: number;
  source: DocumentMetadata;
}

class LlamaIndexService {
  private index: VectorStoreIndex | null = null;
  private documents: Map<string, DocumentMetadata> = new Map();

  constructor() {
    this.initializeSettings();
  }

  private initializeSettings() {
    // For now, use default settings. Can be enhanced to use environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey) {
      Settings.llm = new OpenAI({
        apiKey: openaiApiKey,
        model: 'gpt-4-turbo-preview'
      });
      Settings.embedModel = new OpenAI({
        apiKey: openaiApiKey,
        model: 'text-embedding-3-small'
      });
    } else {
      // Fallback to Ollama if available
      Settings.llm = new Ollama({
        model: 'llama3'
      });
    }
  }

  /**
   * Initialize or load existing vector index
   */
  async initialize(): Promise<void> {
    try {
      // Try to load existing index from disk
      const indexPath = './data/llamaindex-index.json';
      try {
        const indexData = await fs.readFile(indexPath, 'utf8');
        const savedIndex = JSON.parse(indexData);
        this.index = VectorStoreIndex.fromDict(savedIndex);
        console.log('Loaded existing LlamaIndex index');
      } catch (error) {
        console.log('No existing index found, creating new one');
        this.index = new VectorStoreIndex();
      }
    } catch (error) {
      console.error('Failed to initialize LlamaIndex:', error);
      throw error;
    }
  }

  /**
   * Index a directory of documents
   */
  async indexDirectory(dirPath: string, documentType: DocumentMetadata['type']): Promise<{
    success: boolean;
    message: string;
    indexed: number;
    errors: string[];
  }> {
    try {
      if (!this.index) {
        await this.initialize();
      }

      const errors: string[] = [];
      let indexed = 0;

      const reader = new SimpleDirectoryReader();
      const documents = await reader.loadData(dirPath);

      for (const doc of documents) {
        try {
          // Add to index
          await this.index!.insert(doc);

          // Track document metadata
          const metadata: DocumentMetadata = {
            title: doc.text.slice(0, 50) + '...',
            type: documentType,
            date: new Date().toISOString(),
            path: doc.id_,
            size: doc.text.length,
          };

          this.documents.set(doc.id_, metadata);
          indexed++;
        } catch (error) {
          errors.push(`Failed to index document ${doc.id_}: ${error}`);
        }
      }

      // Save index to disk
      await this.saveIndex();

      return {
        success: errors.length === 0,
        message: `Indexed ${indexed} documents with ${errors.length} errors`,
        indexed,
        errors
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to index directory: ${error}`,
        indexed: 0,
        errors: [String(error)]
      };
    }
  }

  /**
   * Index a single document
   */
  async indexDocument(
    content: string,
    title: string,
    type: DocumentMetadata['type'],
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      if (!this.index) {
        await this.initialize();
      }

      const document = new Document(content, {
        id_: `doc_${Date.now()}`,
        metadata: {
          title,
          type,
          ...metadata
        }
      });

      await this.index!.insert(document);
      this.documents.set(document.id_, {
        title,
        type,
        path: metadata?.path || document.id_,
        size: content.length,
        date: new Date().toISOString()
      });

      await this.saveIndex();

      return {
        success: true,
        documentId: document.id_
      };
    } catch (error) {
      return {
        success: false,
        error: String(error)
      };
    }
  }

  /**
   * Search documents using natural language query
   */
  async search(
    query: string,
    topK: number = 5
  ): Promise<{
    success: boolean;
    results?: SearchResult[];
    error?: string;
  }> {
    try {
      if (!this.index) {
        await this.initialize();
      }

      // Create query engine
      const queryEngine = this.index!.asQueryEngine();
      const response = await queryEngine.query(query);

      // Process results
      const results: SearchResult[] = [];

      // Parse the response and extract source information
      if (response?.sourceNodes) {
        for (const node of response.sourceNodes.slice(0, topK)) {
          if (node.node && 'text' in node.node) {
            const docMeta = this.documents.get(node.node.id_);
            if (docMeta) {
              results.push({
                text: node.node.text.slice(0, 500) + '...', // Truncate for UI
                score: node.score || 0,
                source: docMeta
              });
            }
          }
        }
      }

      return {
        success: true,
        results
      };
    } catch (error) {
      return {
        success: false,
        error: String(error)
      };
    }
  }

  /**
   * Get list of all indexed documents
   */
  getDocuments(): DocumentMetadata[] {
    return Array.from(this.documents.values());
  }

  /**
   * Remove a document from the index
   */
  async removeDocument(documentId: string): Promise<boolean> {
    try {
      if (!this.index) return false;

      // Remove from documents map
      this.documents.delete(documentId);

      // Note: LlamaIndex doesn't currently support document removal directly
      // This would require rebuilding the index
      console.warn('Document removal requires index rebuild in current LlamaIndex version');

      return true;
    } catch (error) {
      console.error('Failed to remove document:', error);
      return false;
    }
  }

  /**
   * Save index to disk
   */
  private async saveIndex(): Promise<void> {
    try {
      await fs.mkdir('./data', { recursive: true });
      const indexDict = this.index!.toDict();
      await fs.writeFile('./data/llamaindex-index.json', JSON.stringify(indexDict, null, 2));
    } catch (error) {
      console.error('Failed to save index:', error);
    }
  }

  /**
   * Load index from disk
   */
  private async loadIndex(): Promise<void> {
    try {
      const indexPath = './data/llamaindex-index.json';
      const indexData = await fs.readFile(indexPath, 'utf8');
      const savedIndex = JSON.parse(indexData);
      this.index = VectorStoreIndex.fromDict(savedIndex);
    } catch (error) {
      console.error('Failed to load index:', error);
      this.index = new VectorStoreIndex();
    }
  }
}

// Export singleton instance
export const llamaindexService = new LlamaIndexService();
export type { DocumentMetadata, SearchResult };
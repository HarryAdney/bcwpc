import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import { Document } from 'llamaindex';

interface IngestionResult {
  success: boolean;
  documents: Array<{
    path: string;
    title: string;
    type: string;
    size: number;
    content: string;
  }>;
  errors: string[];
  totalProcessed: number;
}

class DocumentIngestionService {
  private static readonly SUPPORTED_EXTENSIONS = ['.pdf', '.txt', '.html', '.docx'];
  private static readonly DOCUMENT_TYPES = {
    'minutes': /minutes|apm/i,
    'annual-report': /annual|report/i,
    'newsletter': /newsletter/i,
    'policy': /policy/i,
    'consultation': /consultation/i,
    'notice': /notice/i,
    'other': /.*/
  };

  /**
   * Extract text content from various file formats
   */
  private static async extractTextContent(filePath: string, extension: string): Promise<string> {
    try {
      switch (extension.toLowerCase()) {
        case '.pdf':
          return await this.extractFromPdf(filePath);
        case '.txt':
          return await fs.readFile(filePath, 'utf-8');
        case '.html':
          return await this.extractFromHtml(filePath);
        case '.docx':
          return await this.extractFromDocx(filePath);
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }
    } catch (error) {
      console.error(`Failed to extract text from ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Extract text from PDF files
   */
  private static async extractFromPdf(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } catch (error) {
      console.error('PDF extraction failed:', error);
      throw new Error(`PDF extraction failed for ${filePath}`);
    }
  }

  /**
   * Extract text from HTML files (removing tags)
   */
  private static async extractFromHtml(filePath: string): Promise<string> {
    try {
      const htmlContent = await fs.readFile(filePath, 'utf-8');
      // Simple HTML tag removal - could be enhanced with a proper HTML parser
      return htmlContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (error) {
      console.error('HTML extraction failed:', error);
      throw new Error(`HTML extraction failed for ${filePath}`);
    }
  }

  /**
   * Extract text from DOCX files
   * Note: This is a placeholder - would need additional dependencies like mammoth or docx4js
   */
  private static async extractFromDocx(filePath: string): Promise<string> {
    try {
      // For now, return a placeholder message
      // In a real implementation, you'd use libraries like mammoth or docx
      console.warn(`DOCX extraction not implemented yet for ${filePath}`);
      return `DOCX content for ${filePath} - extraction not implemented`;
    } catch (error) {
      console.error('DOCX extraction failed:', error);
      throw new Error(`DOCX extraction failed for ${filePath}`);
    }
  }

  /**
   * Determine document type based on filename
   */
  private static determineDocumentType(filename: string): keyof typeof DocumentIngestionService.DOCUMENT_TYPES {
    const name = path.basename(filename);

    for (const [type, pattern] of Object.entries(this.DOCUMENT_TYPES)) {
      if (pattern.test(name)) {
        return type as keyof typeof this.DOCUMENT_TYPES;
      }
    }

    return 'other';
  }

  /**
   * Generate a readable title from filename
   */
  private static generateTitle(filename: string, fileType: string): string {
    const name = path.basename(filename, path.extname(filename));

    // Remove dates from filename (e.g., "minutes-2024-03-05" -> "March 2025 Minutes")
    let title = name
      .replace(/-/g, ' ')
      .replace(/(\d{4})-(\d{2})/, '$2 $1') // Move year to end
      .replace(/(\d{2})(\d{4})/, '$1 $2') // Separate date and year
      .replace(/\b(\d{4})\b/, '$1') // Keep year
      .replace(/\b(\d{2})\b/g, (match, p1) => {
        // Convert numeric months to names
        const monthMap = {
          '01': 'January', '02': 'February', '03': 'March', '04': 'April',
          '05': 'May', '06': 'June', '07': 'July', '08': 'August',
          '09': 'September', '10': 'October', '11': 'November', '12': 'December'
        };
        return monthMap[p1 as keyof typeof monthMap] || p1;
      })
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Capitalize document type
    if (fileType !== 'other') {
      title = `${title.charAt(0).toUpperCase()}${title.slice(1)}`;
    }

    return title || filename;
  }

  /**
   * Ingest all documents from a directory
   */
  static async ingestDirectory(
    dirPath: string,
    customDocumentType?: string
  ): Promise<IngestionResult> {
    const result: IngestionResult = {
      success: true,
      documents: [],
      errors: [],
      totalProcessed: 0
    };

    try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(file).toLowerCase();

        if (!this.SUPPORTED_EXTENSIONS.includes(ext)) {
          result.errors.push(`Skipped unsupported file type: ${file}`);
          continue;
        }

        try {
          const stat = await fs.stat(filePath);

          // Skip directories
          if (stat.isDirectory()) {
            result.errors.push(`Skipped directory: ${file}`);
            continue;
          }

          // Extract text content
          const content = await this.extractTextContent(filePath, ext);

          // Skip empty files
          if (!content.trim()) {
            result.errors.push(`Skipped empty file: ${file}`);
            continue;
          }

          // Determine document type
          const docType = customDocumentType || this.determineDocumentType(file);

          // Generate title
          const title = this.generateTitle(file, docType);

          result.documents.push({
            path: filePath,
            title,
            type: docType,
            size: stat.size,
            content
          });

        } catch (error) {
          result.errors.push(`Failed to process ${file}: ${error}`);
          result.success = false;
        }
      }

      result.totalProcessed = result.documents.length;

    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to read directory ${dirPath}: ${error}`);
    }

    return result;
  }

  /**
   * Ingest specific parish council document directories
   */
  static async ingestParishDocuments(): Promise<IngestionResult> {
    const basePath = './public/documents';
    const result: IngestionResult = {
      success: true,
      documents: [],
      errors: [],
      totalProcessed: 0
    };

    // Define document directories and their types
    const documentDirectories = [
      { path: `${basePath}/minutes`, type: 'minutes' as const },
      { path: `${basePath}/annual-reports`, type: 'annual-report' as const },
      { path: `${basePath}/newsletters`, type: 'newsletter' as const },
      { path: `${basePath}/public_notices`, type: 'notice' as const },
      { path: basePath, type: 'other' as const } // Root directory for policies etc.
    ];

    for (const dir of documentDirectories) {
      try {
        await fs.access(dir.path); // Check if directory exists
        const dirResult = await this.ingestDirectory(dir.path, dir.type);

        result.documents.push(...dirResult.documents);
        result.errors.push(...dirResult.errors.map(error => `[${dir.type}] ${error}`));

        if (!dirResult.success) {
          result.success = false;
        }
      } catch (error) {
        result.errors.push(`Directory not found: ${dir.path}`);
        result.success = false;
      }
    }

    result.totalProcessed = result.documents.length;
    return result;
  }

  /**
   * Convert ingestion results to LlamaIndex documents
   */
  static toLlamaIndexDocuments(ingestionResult: IngestionResult): Document[] {
    return ingestionResult.documents.map(doc =>
      new Document(doc.content, {
        id_: `doc_${path.basename(doc.path)}`,
        metadata: {
          title: doc.title,
          type: doc.type,
          path: doc.path,
          size: doc.size,
          filename: path.basename(doc.path)
        }
      })
    );
  }
}

export { DocumentIngestionService };
export type { IngestionResult };
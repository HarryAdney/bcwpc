# Public Notices Migration Plan

## Overview

This plan outlines the migration of Public Notices from hard-coded PDF links in `public/documents/public_notices/` to a dynamic, content-driven system using Astro's Content Collections from `src/content/public_notices/`.

## Current State Analysis

### Files Found

- **Public Documents Location**: `/public/documents/public_notices/`
  - 8 PDF files (various dates from 2025-05-01 to 2025-11-04)
  - 1 existing MD file (`public-notice-2025-11-04.md`)

- **Content Collection Location**: `/src/content/public_notices/`
  - 2 PDF files (overlapping with public folder)
  - 1 MD file (`public-notice-2025-11-04.md`)

### Current Implementation Issues

- **Hard-coded links**: 15+ pages contain hard-coded references to PDF files
- **Mixed file types**: Some notices are PDFs, others are markdown
- **Manual maintenance**: Requires manual updates across multiple files
- **No content structure**: Current markdown files lack frontmatter for metadata
- **Inconsistent organization**: Files exist in both `public/documents` and `src/content`

## Proposed Solution

### 1. Content Collection Schema Design

Extend `src/content.config.mjs` to include a `public_notices` collection:

```javascript
const public_notices = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/public_notices' }),
  schema: z.object({
    title: z.string(),
    meetingDate: z.string(),
    meetingType: z.enum(['monthly', 'annual', 'special']),
    publishedDate: z.string(),
    clerk: z.string().default('R C Nolan, Clerk to the Council'),
    agenda: z.array(z.object({
      item: z.string(),
      description: z.string().optional()
    })).optional(),
    hasPDF: z.boolean().default(false),
    pdfFile: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
})
```

### 2. File Organization Strategy

**Approach**: Hybrid system supporting both markdown content and PDF links

- **Primary**: Convert or create markdown files for new notices
- **Secondary**: Maintain links to existing PDFs for backward compatibility
- **Future**: Gradually convert historical PDFs to markdown as resources allow

### 3. Migration Strategy

#### Phase 1: Content Collection Setup

1. Add `public_notices` collection to content config
2. Create standardized markdown template for public notices
3. Migrate existing markdown file with proper frontmatter

#### Phase 2: File Migration

1. **Markdown Files**: Move existing MD files from `/public/documents/public_notices/` to `/src/content/public_notices/` with enhanced frontmatter
2. **PDF Files**: Keep PDFs in `/public/documents/public_notices/` but reference them through content collection
3. **Duplicate Resolution**: Prioritize files in `/src/content/public_notices/` over `/public/documents/public_notices/`

#### Phase 3: Code Updates

1. Create reusable Public Notices component
2. Update all 15+ pages to use dynamic content
3. Implement fallback system for PDF links

### 4. New Component Architecture

#### PublicNotices.astro Component

```astro
---
import { getCollection } from 'astro:content';

interface Props {
  limit?: number;
  showPDF?: boolean;
  featured?: boolean;
}

const { limit = 5, showPDF = true, featured = false } = Astro.props;
const notices = await getCollection('public_notices', ({ data }) => {
  const isPublished = !data.draft;
  const matchesFeatured = featured ? data.featured : true;
  return isPublished && matchesFeatured;
});

const sortedNotices = notices
  .sort((a, b) => new Date(b.data.meetingDate).getTime() - new Date(a.data.meetingDate).getTime())
  .slice(0, limit);
---

<section class="public-notices">
  <h3>Latest Public Notices</h3>
  <ul>
    {sortedNotices.map((notice) => (
      <li>
        <h4>{notice.data.title}</h4>
        <p>Meeting Date: {notice.data.meetingDate}</p>
        <p>Meeting Type: {notice.data.meetingType}</p>

        {notice.data.hasPDF && showPDF ? (
          <a href={notice.data.pdfFile} target="_blank" class="btn">
            View PDF Notice
          </a>
        ) : (
          <a href={`/public-notices/${notice.slug}`} class="btn">
            Read Notice
          </a>
        )}
      </li>
    ))}
  </ul>
</section>
```

#### Individual Notice Page Template

Create dynamic routing for individual notice display:

- **Route**: `/public-notices/[slug]/`
- **Template**: Similar to existing markdown layouts
- **Features**: Full notice content, agenda details, PDF download link

### 5. Implementation Steps

#### Step 1: Create Git Branch

```bash
git checkout -b feature/public-notices-migration
```

#### Step 2: Update Content Configuration

1. Add `public_notices` collection to `src/content.config.mjs`
2. Define schema with all necessary fields
3. Export updated collections object

#### Step 3: File Migration

1. Move existing markdown files to content collection location
2. Add frontmatter to existing markdown files
3. Maintain PDF files in original location with updated references

#### Step 4: Create Components

1. Build `PublicNotices.astro` component
2. Create dynamic notice page template
3. Implement proper TypeScript interfaces

#### Step 5: Update Existing Pages

Replace hard-coded links in 15+ files with new component:

- `/src/pages/index.astro`
- `/src/pages/parish-council/meetings.astro`
- `/src/pages/parish-council/parish-council.astro`
- And 12+ other pages

#### Step 6: Testing & Validation

1. Test component functionality
2. Verify all links work correctly
3. Ensure responsive design
4. Check accessibility compliance

### 6. Migration Timeline

**Estimated Time**: 4-6 hours

- Content configuration: 30 minutes
- File migration: 1 hour
- Component development: 2 hours
- Page updates: 2 hours
- Testing & refinements: 1 hour

### 7. Benefits of New System

- **Maintainability**: Single source of truth for public notices
- **Consistency**: Standardized format across all notices
- **Flexibility**: Easy to add new notice types or metadata
- **Performance**: Astro's built-in optimization for content collections
- **SEO**: Better structured content for search engines
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Future-proof**: Scalable for additional notice types

### 8. Rollback Plan

If issues arise:

1. Keep original files in place during migration
2. Use feature branch for safe testing
3. Maintain backup copies of all modified files
4. Implement gradual rollout to individual pages

### 9. Post-Migration Tasks

1. **Content Cleanup**: Remove duplicates from public documents folder
2. **Documentation**: Update content guidelines for future notices
3. **Training**: Brief content editors on new markdown template
4. **Monitoring**: Watch for any broken links during initial deployment

## Next Steps

1. **Approve Plan**: Review and approve this migration strategy
2. **Create Branch**: Set up git branch for safe implementation
3. **Begin Implementation**: Start with content configuration
4. **Progressive Testing**: Test each component before full deployment
5. **Monitor & Refine**: Address any issues discovered during rollout

This migration will significantly improve the maintainability and user experience of public notices while maintaining backward compatibility with existing PDF files.
;

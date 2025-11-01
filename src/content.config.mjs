// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content'

// 2. Import loader(s)
import { glob } from 'astro/loaders'

// 3. Define your collection(s)

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
  }),
})

const minutes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/minutes' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    chairman: z.string(),
    dated: z.string(),
  }),
})

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    description: z.string(),
    details: z.string().optional(),
    cost: z.string().optional(),
    contact: z.string(),
  }),
})

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

// 4. Export a single `collections` object to register you collection(s)
export const collections = { minutes, projects, events, public_notices }

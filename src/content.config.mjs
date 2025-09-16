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
    category: z.string(),
  }),
})

// 4. Export a single `collections` object to register you collection(s)
export const collections = { minutes, projects, events }

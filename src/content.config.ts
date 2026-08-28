import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const experience = defineCollection({
  loader: glob({ pattern: '*/*.md', base: 'src/content/experience' }),
  schema: z.object({
    // Explicit, not inferred from filename or the loader's generated id —
    // validate-content.mjs asserts en.md -> 'en', ru.md -> 'ru'.
    locale: z.enum(['en', 'ru']),
    title: z.string(),
    // e.g. "Senior Backend Developer" under "Team Lead". Present for some
    // roles/locales in the source and not others — preserved as-is rather
    // than forced symmetric across locales.
    subtitle: z.string().nullable(),
    organization: z.object({
      // Locale-specific display name, exactly as it appears in the source
      // heading (RU sometimes uses a shortened Russian form).
      name: z.string(),
      url: z.string().url(),
    }),
    // Year-only, matching source granularity — no invented month/day precision.
    dateStart: z.string().regex(/^\d{4}$/),
    // null = ongoing; the "Present"/"по наст. время" label is a rendering
    // concern for later milestones, not stored as content.
    dateEnd: z.string().regex(/^\d{4}$/).nullable(),
    tags: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*/*.md', base: 'src/content/projects' }),
  schema: z.object({
    locale: z.enum(['en', 'ru']),
    title: z.string(),
    repoUrl: z.string().url(),
    tags: z.array(z.string()),
  }),
});

export const collections = { experience, projects };

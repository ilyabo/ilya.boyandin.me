import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { renderMarkdown } from './markdown';

const markdownContext = { kind: 'page', slug: 'resume' } as const;

const shortSchema = z.object({
  short: z.boolean().default(true),
});

const contactSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const textItemSchema = shortSchema.extend({
  text: z.string(),
});

const detailSchema = textItemSchema.extend({
  label: z.string(),
});

const educationItemSchema = shortSchema.extend({
  title: z.string(),
  institution: z.string(),
  date: z.union([z.string(), z.number()]),
  details: z.array(detailSchema).default([]),
});

const jobSchema = shortSchema.extend({
  title: z.string(),
  employer: z.string().optional(),
  employerUrl: z.string().optional(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string().optional(),
  bullets: z.array(textItemSchema).default([]),
});

const expertiseGroupSchema = shortSchema.extend({
  label: z.string(),
  text: z.string(),
});

const bulletsSectionSchema = shortSchema.extend({
  id: z.string(),
  title: z.string(),
  type: z.literal('bullets'),
  items: z.array(textItemSchema),
});

const educationSectionSchema = shortSchema.extend({
  id: z.string(),
  title: z.string(),
  type: z.literal('education'),
  items: z.array(educationItemSchema),
});

const experienceSectionSchema = shortSchema.extend({
  id: z.string(),
  title: z.string(),
  type: z.literal('experience'),
  items: z.array(jobSchema),
});

const expertiseSectionSchema = shortSchema.extend({
  id: z.string(),
  title: z.string(),
  type: z.literal('expertise'),
  groups: z.array(expertiseGroupSchema),
});

const sectionSchema = z.discriminatedUnion('type', [
  bulletsSectionSchema,
  educationSectionSchema,
  experienceSectionSchema,
  expertiseSectionSchema,
]);

const resumeSchema = z.object({
  profile: z.object({
    name: z.string(),
    subtitle: z.string(),
    image: z.string(),
    contacts: z.array(contactSchema),
  }),
  summary: z.string(),
  sections: z.array(sectionSchema),
});

type TextItem = z.infer<typeof textItemSchema>;
type Detail = z.infer<typeof detailSchema>;
type EducationItem = z.infer<typeof educationItemSchema>;
type Job = z.infer<typeof jobSchema>;
type ExpertiseGroup = z.infer<typeof expertiseGroupSchema>;
type Resume = z.infer<typeof resumeSchema>;

async function renderInlineMarkdown(content: string) {
  const html = await renderMarkdown(content, markdownContext);
  return html.replace(/^<p>/, '').replace(/<\/p>\n?$/, '');
}

async function withHtml<T extends TextItem>(item: T) {
  return {
    ...item,
    html: await renderInlineMarkdown(item.text),
  };
}

async function withDetailHtml(detail: Detail) {
  return {
    ...detail,
    html: await renderInlineMarkdown(detail.text),
  };
}

async function withEducationHtml(item: EducationItem) {
  return {
    ...item,
    details: await Promise.all(item.details.map(withDetailHtml)),
  };
}

async function withJobHtml(job: Job) {
  return {
    ...job,
    bullets: await Promise.all(job.bullets.map(withHtml)),
  };
}

async function withExpertiseHtml(group: ExpertiseGroup) {
  return {
    ...group,
    html: await renderInlineMarkdown(group.text),
  };
}

export async function getResume() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'resume.yml');
  const parsed = resumeSchema.parse(parse(fs.readFileSync(filePath, 'utf8'))) as Resume;

  return {
    ...parsed,
    summaryHtml: await renderInlineMarkdown(parsed.summary),
    sections: await Promise.all(
      parsed.sections.map(async (section) => {
        if (section.type === 'bullets') {
          return { ...section, items: await Promise.all(section.items.map(withHtml)) };
        }

        if (section.type === 'education') {
          return { ...section, items: await Promise.all(section.items.map(withEducationHtml)) };
        }

        if (section.type === 'experience') {
          return { ...section, items: await Promise.all(section.items.map(withJobHtml)) };
        }

        return { ...section, groups: await Promise.all(section.groups.map(withExpertiseHtml)) };
      })
    ),
  };
}

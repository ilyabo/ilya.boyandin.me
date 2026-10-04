import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { renderMarkdown } from './markdown';

const markdownContext = { kind: 'page', slug: 'resume' } as const;

export const resumeLanguages = ['en', 'de'] as const;
export type ResumeLanguage = (typeof resumeLanguages)[number];

function createResumeSchema(language: ResumeLanguage) {
  const translatedText = z
    .object({
      en: z.string().min(1),
      de: z.string().min(1),
    })
    .transform((text) => text[language]);
  // Proper names and technical lists can be shared by both languages.
  const sharedOrTranslatedText = z.union([z.string().min(1), translatedText]);

  const shortSchema = z.object({
    short: z.boolean().default(true),
  });

  const contactSchema = z.object({
    label: z.string(),
    href: z.string(),
  });

  const textItemSchema = shortSchema.extend({
    text: sharedOrTranslatedText,
  });

  const detailSchema = textItemSchema.extend({
    label: translatedText,
  });

  const educationItemSchema = shortSchema.extend({
    title: translatedText,
    institution: sharedOrTranslatedText,
    date: z.union([z.string(), z.number()]),
    details: z.array(detailSchema).default([]),
  });

  const jobSchema = shortSchema.extend({
    title: translatedText,
    employer: sharedOrTranslatedText.optional(),
    employerUrl: z.string().optional(),
    location: sharedOrTranslatedText.optional(),
    start: translatedText,
    end: translatedText.optional(),
    bullets: z.array(textItemSchema).default([]),
  });

  const expertiseGroupSchema = shortSchema.extend({
    label: translatedText,
    text: sharedOrTranslatedText,
  });

  const bulletsSectionSchema = shortSchema.extend({
    id: z.string(),
    title: translatedText,
    type: z.literal('bullets'),
    items: z.array(textItemSchema),
  });

  const educationSectionSchema = shortSchema.extend({
    id: z.string(),
    title: translatedText,
    type: z.literal('education'),
    items: z.array(educationItemSchema),
  });

  const experienceSectionSchema = shortSchema.extend({
    id: z.string(),
    title: translatedText,
    type: z.literal('experience'),
    items: z.array(jobSchema),
  });

  const expertiseSectionSchema = shortSchema.extend({
    id: z.string(),
    title: translatedText,
    type: z.literal('expertise'),
    groups: z.array(expertiseGroupSchema),
  });

  const sectionSchema = z.discriminatedUnion('type', [
    bulletsSectionSchema,
    educationSectionSchema,
    experienceSectionSchema,
    expertiseSectionSchema,
  ]);

  return z.object({
    ui: z.object({
      lengthLabel: translatedText,
      languageLabel: translatedText,
      short: translatedText,
      full: translatedText,
      home: translatedText,
      more: translatedText,
      title: translatedText,
      description: translatedText,
    }),
    profile: z.object({
      name: z.string(),
      subtitle: translatedText,
      image: z.string(),
      contacts: z.array(contactSchema),
    }),
    summary: translatedText,
    sections: z.array(sectionSchema),
  });
}

type Resume = z.infer<ReturnType<typeof createResumeSchema>>;
type Section = Resume['sections'][number];
type TextItem = Extract<Section, { type: 'bullets' }>['items'][number];
type EducationItem = Extract<Section, { type: 'education' }>['items'][number];
type Detail = EducationItem['details'][number];
type Job = Extract<Section, { type: 'experience' }>['items'][number];
type ExpertiseGroup = Extract<Section, { type: 'expertise' }>['groups'][number];

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

export async function getResume(language: ResumeLanguage = 'en') {
  const filePath = path.join(process.cwd(), 'content', 'data', 'resume.yml');
  const parsed = createResumeSchema(language).parse(parse(fs.readFileSync(filePath, 'utf8')));

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

export type RenderedResume = Awaited<ReturnType<typeof getResume>>;

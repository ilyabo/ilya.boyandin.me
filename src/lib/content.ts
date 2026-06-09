import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

const contentTypes = {
  projects: {
    routePrefix: '/p',
  },
  talks: {
    routePrefix: '/talks',
  },
} as const;

export type ContentType = keyof typeof contentTypes;

const frontmatterSchema = z.object({
  kind: z.string().optional(),
  title: z.string(),
  description: z.string().optional().default(''),
  category: z.string().optional(),
  preview: z.string().optional(),
  date: z.coerce.date(),
  orderDate: z.coerce.date().optional(),
  unlisted: z.boolean().optional().default(false),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface ContentEntry extends Frontmatter {
  content: string;
  slug: string;
  type: ContentType;
  route: string;
  filePath: string;
  orderTimestamp: number;
}

export interface PageContent {
  content: string;
  filePath: string;
  data: Record<string, unknown>;
}

function contentDir(type: ContentType) {
  return path.join(CONTENT_ROOT, type);
}

function entryPath(type: ContentType, slug: string) {
  return path.join(contentDir(type), slug, 'index.md');
}

function readEntry(type: ContentType, slug: string): ContentEntry {
  const filePath = entryPath(type, slug);
  const file = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(file);
  const data = frontmatterSchema.parse(parsed.data);
  const route = `${contentTypes[type].routePrefix}/${slug}`;
  const orderTimestamp = (data.orderDate ?? data.date).getTime();

  return {
    ...data,
    content: parsed.content,
    slug,
    type,
    route,
    filePath: path.relative(process.cwd(), filePath),
    orderTimestamp,
  };
}

export function getEntries(type: ContentType) {
  return fs
    .readdirSync(contentDir(type), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readEntry(type, entry.name))
    .filter((entry) => !entry.unlisted)
    .sort((a, b) => b.orderTimestamp - a.orderTimestamp);
}

export function getAllContentEntries() {
  return [...getEntries('projects'), ...getEntries('talks')];
}

export function getEntry(type: ContentType, slug: string) {
  return readEntry(type, slug);
}

export function getEntrySlugs(type: ContentType) {
  return getEntries(type).map((entry) => entry.slug);
}

export function getPageContent(slug: string): PageContent {
  const folderIndexPath = path.join(CONTENT_ROOT, slug, 'index.md');
  const filePath = fs.existsSync(folderIndexPath) ? folderIndexPath : path.join(CONTENT_ROOT, `${slug}.md`);
  const file = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(file);

  return {
    content: parsed.content,
    filePath: path.relative(process.cwd(), filePath),
    data: parsed.data,
  };
}

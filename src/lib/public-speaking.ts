import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { formatDate } from './format';

const publicSpeakingItemSchema = z.object({
  title: z.string(),
  kind: z.string().default('talk'),
  year: z.number(),
  date: z.string().optional(),
  route: z.string().optional(),
  href: z.string().optional(),
  venue: z.string().optional(),
  venueUrl: z.string().optional(),
  location: z.string().optional(),
  note: z.string().optional(),
});

const publicSpeakingSchema = z.object({
  items: z.array(publicSpeakingItemSchema),
});

export type PublicSpeakingItem = z.infer<typeof publicSpeakingItemSchema> & {
  url?: string;
  displayDate: string;
};

function sortKey(item: z.infer<typeof publicSpeakingItemSchema>) {
  return item.date ?? `${item.year}-01-01`;
}

export function getPublicSpeakingItems(): PublicSpeakingItem[] {
  const filePath = path.join(process.cwd(), 'content', 'data', 'public-speaking.yml');
  const parsed = publicSpeakingSchema.parse(parse(fs.readFileSync(filePath, 'utf8')));

  return parsed.items
    .map((item) => ({
      ...item,
      url: item.route ?? item.href,
      displayDate: item.date ? formatDate(item.date) : String(item.year),
    }))
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
}

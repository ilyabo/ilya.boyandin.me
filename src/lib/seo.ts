import metadata from '../../content/metadata.json';
import type { ContentEntry } from './content';
import { previewMediaPath } from './media';

export const SITE_URL = 'https://ilya.boyandin.me';

const MAX_DESCRIPTION_LENGTH = 160;

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function truncateDescription(value: string) {
  const clean = compactWhitespace(value);
  if (clean.length <= MAX_DESCRIPTION_LENGTH) return clean;

  const shortened = clean.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 80 ? lastSpace : shortened.length).trim()}...`;
}

export function stripMarkdown(value = '') {
  return compactWhitespace(
    value
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<button[\s\S]*?<\/button>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#>*_`~|-]/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
  );
}

export function absoluteUrl(path = '') {
  if (!path || path === '/') return SITE_URL;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageTitle(title?: string) {
  return title ? `${title} | Ilya Boyandin` : metadata.title;
}

export function entryDescription(entry: Pick<ContentEntry, 'content' | 'date' | 'description' | 'kind' | 'title'>) {
  if (entry.description && compactWhitespace(entry.description)) {
    return truncateDescription(entry.description);
  }

  const excerpt = stripMarkdown(entry.content ?? '');
  if (excerpt) return truncateDescription(excerpt);

  const kind = entry.kind === 'talk' ? 'talk' : 'project';
  const year = entry.date ? new Date(entry.date).getFullYear() : null;
  return truncateDescription(
    `${entry.title} is a ${year ? `${year} ` : ''}${kind} by Ilya Boyandin, focused on interactive software, maps, and data visualization.`
  );
}

export function entryImageUrl(entry: Pick<ContentEntry, 'preview' | 'slug' | 'type'>) {
  const path = previewMediaPath(entry);
  return path ? absoluteUrl(path) : null;
}

export function creativeWorkJsonLd(entry: ContentEntry) {
  const image = entryImageUrl(entry);
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': entry.kind === 'talk' ? 'PresentationDigitalDocument' : 'CreativeWork',
    name: entry.title,
    headline: entry.title,
    description: entryDescription(entry),
    url: absoluteUrl(entry.route),
    author: {
      '@type': 'Person',
      name: 'Ilya Boyandin',
      url: SITE_URL,
    },
  };

  if (entry.date) data.datePublished = new Date(entry.date).toISOString();
  if (image) data.image = image;

  return data;
}

import type { ContentEntry } from './content';

const optimizableImageExtensions = new Set([
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
]);

const publicContentTypeDir = {
  projects: 'projects',
  talks: 'talks',
} as const;

function extension(value: string) {
  const clean = value.split(/[?#]/)[0] ?? value;
  const dot = clean.lastIndexOf('.');
  return dot >= 0 ? clean.slice(dot).toLowerCase() : '';
}

export function isExternalUrl(value: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//');
}

export function isRootRelativePath(value: string) {
  return value.startsWith('/');
}

export function isOptimizableImage(value: string) {
  return optimizableImageExtensions.has(extension(value));
}

export function publicMediaBasePath(entry: Pick<ContentEntry, 'type' | 'slug'>) {
  return `/media/${publicContentTypeDir[entry.type]}/${entry.slug}`;
}

export function publicMediaPath(entry: Pick<ContentEntry, 'type' | 'slug'>, mediaPath: string) {
  if (isExternalUrl(mediaPath) || isRootRelativePath(mediaPath)) return mediaPath;
  return `${publicMediaBasePath(entry)}/${mediaPath.replace(/^\.?\//, '')}`;
}

export function previewMediaPath(entry: Pick<ContentEntry, 'type' | 'slug' | 'preview'>) {
  return entry.preview ? publicMediaPath(entry, entry.preview) : null;
}

export function markdownMediaPath(entry: Pick<ContentEntry, 'type' | 'slug'>, mediaPath: string) {
  return publicMediaPath(entry, mediaPath);
}

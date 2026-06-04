import metadata from '../content/metadata.json';
import { MEDIA_DIR, SITE_URL } from '../config';

const MAX_DESCRIPTION_LENGTH = 160;

function compactWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function truncateDescription(value) {
  const clean = compactWhitespace(value);
  if (clean.length <= MAX_DESCRIPTION_LENGTH) return clean;

  const shortened = clean.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 80 ? lastSpace : shortened.length).trim()}…`;
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

export function postUrlPath(post) {
  const prefix = post.path === 'projects' ? 'p' : post.path;
  return `/${prefix}/${post.slug}`;
}

export function absoluteUrl(path = '') {
  if (!path || path === '/') return SITE_URL;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function postImageUrl(post) {
  if (!post?.preview) return null;
  return absoluteUrl(`/${MEDIA_DIR}/${post.path}/${post.slug}/${post.preview}`);
}

export function postDescription(post) {
  if (post.description && compactWhitespace(post.description)) {
    return truncateDescription(post.description);
  }

  const excerpt = stripMarkdown(post.content ?? '');
  if (excerpt) return truncateDescription(excerpt);

  const kind = post.kind === 'talk' ? 'talk' : 'project';
  const year = post.date ? new Date(post.date).getFullYear() : null;
  return truncateDescription(
    `${post.title} is a ${year ? `${year} ` : ''}${kind} by Ilya Boyandin, focused on interactive software, maps, and data visualization.`
  );
}

export function pageTitle(title) {
  return title ? `${title} | Ilya Boyandin` : metadata.title;
}

export function creativeWorkJsonLd(post) {
  const url = absoluteUrl(postUrlPath(post));
  const image = postImageUrl(post);
  const data = {
    '@context': 'https://schema.org',
    '@type': post.kind === 'talk' ? 'PresentationDigitalDocument' : 'CreativeWork',
    name: post.title,
    headline: post.title,
    description: postDescription(post),
    url,
    author: {
      '@type': 'Person',
      name: 'Ilya Boyandin',
      url: SITE_URL,
    },
  };

  if (post.date) data.datePublished = new Date(post.date).toISOString();
  if (image) data.image = image;

  return data;
}

// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const contentMediaTypes = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.m4a': 'audio/mp4',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
};

function contentMediaPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath).replace(/^\/media\//, '');
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.includes('..') || parts.length < 2) return null;

  const [sectionOrSlug, slugOrFile, ...rest] = parts;
  const contentRoot = path.join(process.cwd(), 'content');

  if (sectionOrSlug === 'projects' || sectionOrSlug === 'talks') {
    return path.join(contentRoot, sectionOrSlug, slugOrFile, ...rest);
  }

  return path.join(contentRoot, sectionOrSlug, slugOrFile, ...rest);
}

function contentMediaDevServer() {
  return {
    name: 'content-media-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.startsWith('/media/')) return next();

        const filePath = contentMediaPath(url.pathname);
        if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();

        res.setHeader('Content-Type', contentMediaTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

export default defineConfig({
  site: 'https://ilya.boyandin.me',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss(), contentMediaDevServer()],
  },
});

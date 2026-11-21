// @ts-check
import path from 'node:path';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import serveStatic from 'serve-static';
import { isMediaFile } from './scripts/content-media.js';

function contentMediaDevServer() {
  return {
    name: 'content-media-dev-server',
    configureServer(server) {
      const serveMedia = serveStatic(path.resolve('content'), { index: false, redirect: false });
      server.middlewares.use('/media', (req, res, next) => {
        const { pathname } = new URL(req.url, 'http://localhost');
        if (!isMediaFile(pathname)) return next();
        serveMedia(req, res, (error) => {
          // Vite turns forwarded HTTP errors (including unsatisfiable ranges) into 500s.
          if (error?.statusCode >= 400 && error.statusCode < 500) {
            res.writeHead(error.statusCode, error.headers);
            return res.end();
          }
          next(error);
        });
      });
    },
  };
}

export default defineConfig({
  integrations: [
    react(),
    {
      name: 'separate-vite-caches',
      hooks: {
        'astro:config:setup'({ command, config, updateConfig }) {
          // Each preview address needs its own optimized modules during client-side navigation.
          const cache = command === 'dev' ? `dev-${config.server.host || 'localhost'}-${config.server.port}` : command;
          updateConfig({ vite: { cacheDir: `node_modules/.vite/${cache}` } });
        },
      },
    },
  ],
  site: 'https://ilya.boyandin.me',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss(), contentMediaDevServer()],
  },
});

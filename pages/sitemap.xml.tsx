import { GetServerSideProps } from 'next';
import { SITE_URL } from '../config';
import { getAllPosts } from '../lib/api';

const Sitemap = () => null;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const urlEntry = (path: string) => {
  const normalizedPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `  <url><loc>${escapeXml(`${SITE_URL}${normalizedPath}`)}</loc></url>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const staticPaths = ['/', '/projects', '/talks', '/resume', '/music'];
  const projectPaths = getAllPosts('projects').map((post) => `/p/${post.slug}`);
  const talkPaths = getAllPosts('talks').map((post) => `/talks/${post.slug}`);
  const paths = [...staticPaths, ...projectPaths, ...talkPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(urlEntry).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

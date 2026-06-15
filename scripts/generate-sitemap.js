const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = 'https://ilya.boyandin.me';
const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

const staticPaths = ['/', '/projects', '/talks', '/resume', '/music'];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getContentPaths(contentType, urlPrefix) {
  const dir = path.join(CONTENT_DIR, contentType);

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      const mdPath = path.join(dir, entry.name, 'index.md');
      if (!fs.existsSync(mdPath)) return false;

      const file = fs.readFileSync(mdPath, 'utf8');
      const { data } = matter(file);
      return !data.unlisted;
    })
    .map((entry) => `${urlPrefix}/${entry.name}`)
    .sort();
}

function toUrlEntry(sitePath) {
  const normalizedPath = sitePath === '/' ? '/' : sitePath.replace(/\/$/, '');
  return `  <url><loc>${escapeXml(`${SITE_URL}${normalizedPath}`)}</loc></url>`;
}

const paths = [
  ...staticPaths,
  ...getContentPaths('projects', '/p'),
  ...getContentPaths('talks', '/talks'),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(toUrlEntry).join('\n')}
</urlset>
`;

fs.writeFileSync(SITEMAP_PATH, sitemap);
console.log(`Generated ${path.relative(process.cwd(), SITEMAP_PATH)} with ${paths.length} URLs`);

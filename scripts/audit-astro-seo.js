const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://ilya.boyandin.me';
const DIST_DIR = path.join(process.cwd(), 'dist');
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function attr(html, pattern) {
  return html.match(pattern)?.[1] ?? '';
}

function pathForUrl(url) {
  const sitePath = url.replace(SITE_URL, '') || '/';
  if (sitePath === '/') return path.join(DIST_DIR, 'index.html');
  return path.join(DIST_DIR, sitePath.replace(/^\//, ''), 'index.html');
}

function sitemapUrls() {
  const xml = read(SITEMAP_PATH);
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

const urls = sitemapUrls();
const issues = [];

for (const url of urls) {
  const filePath = pathForUrl(url);
  if (!fs.existsSync(filePath)) {
    issues.push(`${url}: missing generated HTML at ${path.relative(process.cwd(), filePath)}`);
    continue;
  }

  const html = read(filePath);
  const title = attr(html, /<title>(.*?)<\/title>/);
  const description = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const ogTitle = attr(html, /<meta property="og:title" content="([^"]*)"/);
  const ogDescription = attr(html, /<meta property="og:description" content="([^"]*)"/);
  const ogUrl = attr(html, /<meta property="og:url" content="([^"]*)"/);
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const twitterImage = attr(html, /<meta name="twitter:image" content="([^"]*)"/);

  if (!title) issues.push(`${url}: missing title`);
  if (!description) issues.push(`${url}: missing meta description`);
  if (description.length > 170) issues.push(`${url}: meta description is too long (${description.length})`);
  if (canonical !== url) issues.push(`${url}: canonical mismatch (${canonical || 'missing'})`);
  if (!ogTitle) issues.push(`${url}: missing og:title`);
  if (!ogDescription) issues.push(`${url}: missing og:description`);
  if (ogUrl !== url) issues.push(`${url}: og:url mismatch (${ogUrl || 'missing'})`);
  if (!ogImage) issues.push(`${url}: missing og:image`);
  if (!twitterImage) issues.push(`${url}: missing twitter:image`);
}

if (issues.length) {
  console.error(`SEO audit failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`SEO audit passed for ${urls.length} sitemap URL(s)`);

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else files.push(fullPath);
  }

  return files;
}

function isExternal(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//');
}

function cleanUrl(value) {
  return value.split('#')[0].split('?')[0];
}

function hasExtension(value) {
  return Boolean(path.extname(value));
}

function generatedPathForUrl(value) {
  const clean = cleanUrl(value);
  if (!clean || clean === '/') return path.join(DIST_DIR, 'index.html');
  const relative = clean.replace(/^\//, '');
  return hasExtension(clean)
    ? path.join(DIST_DIR, relative)
    : path.join(DIST_DIR, relative, 'index.html');
}

const htmlFiles = walk(DIST_DIR).filter((file) => file.endsWith('.html'));
const issues = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = `/${path.relative(DIST_DIR, file).replace(/\/index\.html$/, '').replace(/^index\.html$/, '')}`;

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!value || value.startsWith('#') || isExternal(value)) continue;
    if (!value.startsWith('/')) continue;

    const clean = cleanUrl(value);
    if (!clean) continue;

    if (clean !== '/' && clean.endsWith('/') && !hasExtension(clean)) {
      issues.push(`${page}: non-canonical trailing-slash link ${value}`);
    }

    const target = generatedPathForUrl(clean);
    if (!fs.existsSync(target)) {
      issues.push(`${page}: missing internal target ${value}`);
    }
  }
}

if (issues.length) {
  console.error(`Link audit failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Link audit passed for ${htmlFiles.length} generated HTML file(s)`);

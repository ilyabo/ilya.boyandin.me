const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'astro-migration');
const SITE_URL = 'https://ilya.boyandin.me';

const staticRoutes = ['/', '/projects', '/talks', '/resume', '/music'];
const priorityPages = [
  'sqlrooms',
  'flowmap-city',
  'flowmap.blue',
  'flowmap.gl',
  'fsq-spatial-desktop',
  'fsq-studio',
  'column-flow',
  'mapcanv',
  'flowstrates',
  'swiss-maps',
];

function readContentEntries(contentType, routePrefix) {
  const dir = path.join(CONTENT_DIR, contentType);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const filePath = path.join(dir, entry.name, 'index.md');
      const file = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(file);
      const fields = Object.keys(parsed.data).sort();
      return {
        type: contentType,
        slug: entry.name,
        route: `${routePrefix}/${entry.name}`,
        file: path.relative(process.cwd(), filePath),
        title: parsed.data.title ?? null,
        description: parsed.data.description ?? null,
        date: parsed.data.date ?? null,
        orderDate: parsed.data.orderDate ?? null,
        preview: parsed.data.preview ?? null,
        category: parsed.data.category ?? null,
        kind: parsed.data.kind ?? null,
        unlisted: parsed.data.unlisted === true,
        fields,
        contentChars: parsed.content.trim().length,
        imageRefs: Array.from(parsed.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)).map((match) => match[1]),
        embedKinds: Array.from(parsed.content.matchAll(/<embed\s+kind=["']?([^"'\s>]+)["']?/g)).map(
          (match) => match[1]
        ),
        iframeCount: (parsed.content.match(/<iframe\b/g) ?? []).length,
        videoCount: (parsed.content.match(/<video\b/g) ?? []).length,
      };
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      result.push({
        path: path.relative(process.cwd(), fullPath),
        extension: path.extname(entry.name).toLowerCase() || '[none]',
        bytes: stat.size,
      });
    }
  }
  return result.sort((a, b) => a.path.localeCompare(b.path));
}

function summarizeCounts(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function readSitemapRoutes() {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  return Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g))
    .map((match) => match[1].replace(SITE_URL, '') || '/')
    .sort();
}

function writeJson(fileName, data) {
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(fileName, content) {
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), content);
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const projects = readContentEntries('projects', '/p');
  const talks = readContentEntries('talks', '/talks');
  const contentEntries = [...projects, ...talks];
  const publicFiles = walkFiles(PUBLIC_DIR);
  const mediaFiles = publicFiles.filter((file) => file.path.startsWith('public/media/'));
  const assetFiles = publicFiles.filter((file) => file.path.startsWith('public/assets/'));
  const sitemapRoutes = readSitemapRoutes();
  const generatedRoutes = [
    ...staticRoutes,
    ...contentEntries.filter((entry) => !entry.unlisted).map((entry) => entry.route),
  ].sort();

  const routeInventory = {
    generatedAt: new Date().toISOString(),
    staticRoutes,
    generatedRoutes,
    sitemapRoutes,
    routeCount: generatedRoutes.length,
    sitemapRouteCount: sitemapRoutes.length,
    sitemapMissingFromGenerated: sitemapRoutes.filter((route) => !generatedRoutes.includes(route)),
    generatedMissingFromSitemap: generatedRoutes.filter((route) => !sitemapRoutes.includes(route)),
  };

  const contentInventory = {
    generatedAt: routeInventory.generatedAt,
    totalEntries: contentEntries.length,
    publishedEntries: contentEntries.filter((entry) => !entry.unlisted).length,
    unlistedEntries: contentEntries.filter((entry) => entry.unlisted).map((entry) => entry.route),
    projects: projects.length,
    talks: talks.length,
    fieldCounts: summarizeCounts(
      contentEntries.flatMap((entry) => entry.fields.map((field) => ({ field }))),
      (item) => item.field
    ),
    emptyDescriptionRoutes: contentEntries
      .filter((entry) => !entry.description)
      .map((entry) => entry.route),
    mediaHeavyRoutes: contentEntries
      .filter((entry) => entry.imageRefs.length >= 4 || entry.iframeCount > 0 || entry.videoCount > 0)
      .map((entry) => ({
        route: entry.route,
        imageRefs: entry.imageRefs.length,
        iframeCount: entry.iframeCount,
        videoCount: entry.videoCount,
      })),
    priorityProjectRoutes: priorityPages.map((slug) => `/p/${slug}`),
    entries: contentEntries,
  };

  const mediaInventory = {
    generatedAt: routeInventory.generatedAt,
    publicFileCount: publicFiles.length,
    mediaFileCount: mediaFiles.length,
    assetFileCount: assetFiles.length,
    filesByExtension: summarizeCounts(publicFiles, (file) => file.extension),
    mediaFilesBySection: summarizeCounts(mediaFiles, (file) => file.path.split('/').slice(0, 3).join('/')),
    largestFiles: [...publicFiles].sort((a, b) => b.bytes - a.bytes).slice(0, 40),
  };

  const baseline = `# Astro Migration Baseline

Generated: ${routeInventory.generatedAt}

## Route Inventory

- Static routes: ${staticRoutes.length}
- Generated routes: ${generatedRoutes.length}
- Sitemap routes: ${sitemapRoutes.length}
- Sitemap routes missing from generated routes: ${routeInventory.sitemapMissingFromGenerated.length}
- Generated routes missing from sitemap: ${routeInventory.generatedMissingFromSitemap.length}

## Content Inventory

- Total content entries: ${contentInventory.totalEntries}
- Published entries: ${contentInventory.publishedEntries}
- Unlisted entries: ${contentInventory.unlistedEntries.length}
- Projects: ${contentInventory.projects}
- Talks: ${contentInventory.talks}
- Empty description routes: ${contentInventory.emptyDescriptionRoutes.length}
- Media-heavy routes: ${contentInventory.mediaHeavyRoutes.length}

## Media Inventory

- Public files: ${mediaInventory.publicFileCount}
- Public media files: ${mediaInventory.mediaFileCount}
- Public asset files: ${mediaInventory.assetFileCount}

## First-Pass Priority Project Routes

${contentInventory.priorityProjectRoutes.map((route) => `- ${route}`).join('\n')}

## Generated Files

- \`route-inventory.json\`
- \`content-inventory.json\`
- \`media-inventory.json\`
- \`routes-current.txt\`
- \`search-console-baseline.md\`
`;

  writeJson('route-inventory.json', routeInventory);
  writeJson('content-inventory.json', contentInventory);
  writeJson('media-inventory.json', mediaInventory);
  writeText('routes-current.txt', `${generatedRoutes.join('\n')}\n`);
  writeText('baseline.md', baseline);

  console.log(`Wrote Astro migration inventory to ${path.relative(process.cwd(), OUTPUT_DIR)}`);
}

main();

const fs = require('node:fs');
const path = require('node:path');

const contentRoot = path.join(process.cwd(), 'content');
const targetName = process.argv[2] ?? 'dist';
const mediaRoot =
  targetName === 'dist'
    ? path.join(process.cwd(), 'dist', 'media')
    : path.join(process.cwd(), 'public', 'media');

const contentSections = ['projects', 'talks'];
const reservedContentDirs = new Set([...contentSections, 'data']);
const mediaExtensions = new Set([
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.m4a',
  '.mov',
  '.mp3',
  '.mp4',
  '.ogg',
  '.pdf',
  '.png',
  '.svg',
  '.wav',
  '.webm',
  '.webp',
]);

function isMediaFile(filePath) {
  return mediaExtensions.has(path.extname(filePath).toLowerCase());
}

function copyFile(sourcePath, targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function copyMediaTree(sourceRoot, targetRoot) {
  if (!fs.existsSync(sourceRoot)) return 0;

  let copied = 0;
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    const sourcePath = path.join(sourceRoot, entry.name);
    const targetPath = path.join(targetRoot, entry.name);

    if (entry.isDirectory()) {
      copied += copyMediaTree(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile() && isMediaFile(sourcePath)) {
      copyFile(sourcePath, targetPath);
      copied += 1;
    }
  }

  return copied;
}

let copied = 0;

for (const section of contentSections) {
  const sectionRoot = path.join(contentRoot, section);
  const mediaSectionRoot = path.join(mediaRoot, section);

  fs.rmSync(mediaSectionRoot, { recursive: true, force: true });

  for (const entry of fs.readdirSync(sectionRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    copied += copyMediaTree(path.join(sectionRoot, entry.name), path.join(mediaSectionRoot, entry.name));
  }
}

for (const entry of fs.readdirSync(contentRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || reservedContentDirs.has(entry.name)) continue;
  if (!fs.existsSync(path.join(contentRoot, entry.name, 'index.md'))) continue;

  const mediaPageRoot = path.join(mediaRoot, entry.name);
  fs.rmSync(mediaPageRoot, { recursive: true, force: true });
  copied += copyMediaTree(path.join(contentRoot, entry.name), mediaPageRoot);
}

console.log(`Copied ${copied} colocated media files to ${path.relative(process.cwd(), mediaRoot)}`);

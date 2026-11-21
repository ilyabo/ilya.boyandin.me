const path = require('node:path');

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

module.exports = { isMediaFile };

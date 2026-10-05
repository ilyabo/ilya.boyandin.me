import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const { values } = parseArgs({
  options: {
    lang: { type: 'string', default: 'de' },
    output: { type: 'string' },
    python: { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
});

if (values.help) {
  console.log('Usage: pnpm resume:pdf [--lang de|en] [--output path.pdf] [--python python3]');
  process.exit(0);
}
if (!['de', 'en'].includes(values.lang)) {
  throw new Error('--lang must be de or en');
}

const localPython = path.join(root, '.venv/bin/python');
const python = values.python
  ? (values.python.includes(path.sep) ? path.resolve(values.python) : values.python)
  : (existsSync(localPython) ? localPython : 'python3');
// Check prerequisites before starting Vite or attempting to write a PDF.
const prerequisite = spawnSync(python, ['-c', 'import reportlab'], { encoding: 'utf8' });
if (prerequisite.error || prerequisite.status !== 0) {
  console.error(prerequisite.error?.code === 'ENOENT'
    ? `Python interpreter "${python}" was not found.`
    : prerequisite.error
      ? `Could not run Python: ${prerequisite.error.message}`
      : `Python could not load ReportLab:\n${prerequisite.stderr.trim()}`);
  console.error(`\nFrom the repository root, run:\n  python3 -m venv .venv\n  .venv/bin/python -m pip install -r scripts/requirements-resume-pdf.txt\n  pnpm resume:pdf --lang ${values.lang}`);
  process.exit(1);
}

const output = path.resolve(values.output ?? path.join(root, 'output/pdf', `ilya-boyandin-cv-${values.lang}.pdf`));
// Share the website's validation, translations, and Markdown rendering.
process.chdir(root);
const server = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true, ws: false },
});
let resume;
try {
  const { getResume } = await server.ssrLoadModule('/src/lib/resume.ts');
  resume = await getResume(values.lang);
} finally {
  await server.close();
}

const result = spawnSync(python, [path.join(root, 'scripts/render-resume-pdf.py'), '--output', output], {
  input: JSON.stringify({ ...resume, language: values.lang }),
  encoding: 'utf8',
});
if (result.error) throw result.error;
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exitCode = result.status ?? 1;

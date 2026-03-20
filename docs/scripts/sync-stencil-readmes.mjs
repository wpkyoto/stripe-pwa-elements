import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

function stripLeadingH1(markdown) {
  const lines = markdown.split('\n');
  if (lines[0]?.startsWith('# ')) {
    return lines.slice(1).join('\n').replace(/^\n+/, '');
  }
  return markdown;
}

function stripMermaidStyleLines(markdown) {
  return markdown.replace(/```mermaid[\s\S]*?```/g, block => {
    const lines = block.split('\n');
    const filtered = lines.filter(line => !line.trimStart().startsWith('style '));
    return filtered.join('\n');
  });
}

function toTitleFromDirName(dirName) {
  return `<${dirName}>`;
}

function localeOutDir(docsRoot, locale) {
  if (locale === 'root') {
    return path.join(docsRoot, 'src', 'content', 'docs', 'components');
  }

  return path.join(docsRoot, 'src', 'content', 'docs', locale, 'components');
}

async function fileExists(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

async function main() {
  const docsRoot = process.cwd();
  const repoRoot = path.resolve(docsRoot, '..');
  const componentsRoot = path.join(repoRoot, 'src', 'components');
  const locales = ['root', 'en'];
  const outDirs = locales.map(locale => ({ locale, outDir: localeOutDir(docsRoot, locale) }));

  for (const { outDir } of outDirs) {
    await mkdir(outDir, { recursive: true });
  }

  const entries = await readdir(componentsRoot, { withFileTypes: true });
  const componentDirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

  const written = {};

  for (const dirName of componentDirs) {
    const srcReadme = path.join(componentsRoot, dirName, 'readme.md');
    if (!(await fileExists(srcReadme))) {
      continue;
    }

    const raw = await readFile(srcReadme, 'utf8');
    const body = stripMermaidStyleLines(stripLeadingH1(raw)).trim();
    const title = toTitleFromDirName(dirName);

    for (const { locale, outDir } of outDirs) {
      const outPath = path.join(outDir, `${dirName}.md`);
      const notice =
        locale === 'en'
          ? `> This page is auto-generated from \`${path.relative(repoRoot, srcReadme)}\`.\n\n`
          : `> このページは \`${path.relative(repoRoot, srcReadme)}\` から自動生成されています。\n\n`;

      const out = `---\ntitle: ${title}\ndescription: Component API reference.\n---\n\n${notice}${body}\n`;

      await writeFile(outPath, out, 'utf8');
      written[locale] ||= [];
      written[locale].push(path.relative(docsRoot, outPath));
    }
  }

  // Keep a lightweight manifest for debugging/CI logs.
  // Note: This file is gitignored.
  const manifestPath = path.join(localeOutDir(docsRoot, 'root'), '_manifest.json');
  await writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), files: written }, null, 2) + '\n', 'utf8');
}

await main();


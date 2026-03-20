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

/**
 * Extract @example blocks from JSDoc comments in a TSX source file.
 * Returns an array of { memberName, description, code } objects.
 */
function extractExamples(source) {
  const examples = [];
  // Match JSDoc comment blocks
  const jsdocPattern = /\/\*\*([\s\S]*?)\*\//g;
  let jsdocMatch;

  while ((jsdocMatch = jsdocPattern.exec(source)) !== null) {
    const comment = jsdocMatch[1];
    const afterComment = source.slice(jsdocMatch.index + jsdocMatch[0].length, jsdocMatch.index + jsdocMatch[0].length + 200);

    // Determine what this JSDoc is attached to
    const memberMatch = afterComment.match(/@(?:Prop|Method|Event|State)\([^)]*\)\s*(?:public\s+)?(?:async\s+)?(?:readonly\s+)?(\w+)/);
    const memberName = memberMatch ? memberMatch[1] : '';

    // Extract description (first line before @tags)
    const descLines = comment.split('\n').map(l => l.replace(/^\s*\*\s?/, '').trim()).filter(l => l && !l.startsWith('@'));
    const description = descLines[0] || '';

    // Find @example blocks by splitting on @example and extracting code blocks
    const parts = comment.split('@example');
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const codeMatch = part.match(/```(\w*)\n([\s\S]*?)```/);
      if (codeMatch) {
        const code = codeMatch[2]
          .split('\n')
          .map(line => line.replace(/^\s*\*\s?/, ''))
          .join('\n')
          .trim();
        examples.push({ memberName, description, code });
      }
    }
  }

  return examples;
}

/**
 * Detect language hint for a code block.
 */
function detectLang(code) {
  if (/^\s*</.test(code)) {
    return 'html';
  }
  return 'js';
}

/**
 * Build a usage examples section from extracted @example blocks.
 */
function buildExamplesSection(examples, locale) {
  if (examples.length === 0) {
    return '';
  }

  const heading = locale === 'en' ? '## Usage Examples' : '## 使用例';
  const lines = [heading, ''];

  // Group by memberName, deduplicate by code content
  const seen = new Set();
  const grouped = new Map();
  for (const ex of examples) {
    if (seen.has(ex.code)) {
      continue;
    }
    seen.add(ex.code);
    const key = ex.memberName || '_unnamed';
    if (!grouped.has(key)) {
      grouped.set(key, { description: ex.description, memberName: ex.memberName, codes: [] });
    }
    grouped.get(key).codes.push(ex.code);
  }

  for (const [, group] of grouped) {
    if (group.description && group.memberName) {
      lines.push(`### ${group.memberName}`, '');
      lines.push(group.description, '');
    }
    for (const code of group.codes) {
      const lang = detectLang(code);
      lines.push(`\`\`\`${lang}`, code, '```', '');
    }
  }

  return lines.join('\n');
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

    // Extract @example blocks from the TSX source file
    const tsxPath = path.join(componentsRoot, dirName, `${dirName}.tsx`);
    let examples = [];
    if (await fileExists(tsxPath)) {
      const tsxSource = await readFile(tsxPath, 'utf8');
      examples = extractExamples(tsxSource);
    }

    for (const { locale, outDir } of outDirs) {
      const outPath = path.join(outDir, `${dirName}.md`);
      const notice =
        locale === 'en'
          ? `> This page is auto-generated from \`${path.relative(repoRoot, srcReadme)}\`.\n\n`
          : `> このページは \`${path.relative(repoRoot, srcReadme)}\` から自動生成されています。\n\n`;

      const examplesSection = buildExamplesSection(examples, locale === 'en' ? 'en' : 'ja');

      const out = examplesSection
        ? `---\ntitle: ${title}\ndescription: Component API reference.\n---\n\n${notice}${examplesSection}\n${body}\n`
        : `---\ntitle: ${title}\ndescription: Component API reference.\n---\n\n${notice}${body}\n`;

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

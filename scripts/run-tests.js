#!/usr/bin/env node
/**
 * Cross-platform test runner script
 *
 * This script provides cross-platform test filtering for the test pyramid:
 * - unit: Pure unit tests (services, utils, and *.unit.spec.ts)
 * - component: Stencil component rendering tests (*.spec.tsx)
 * - e2e: End-to-end tests (*.e2e.ts)
 *
 * Usage:
 *   node scripts/run-tests.js unit
 *   node scripts/run-tests.js component
 *   node scripts/run-tests.js e2e
 */

const { execSync, spawn } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const testType = process.argv[2];

if (!testType || !['unit', 'component', 'e2e'].includes(testType)) {
  console.error('Usage: node scripts/run-tests.js <unit|component|e2e>');
  process.exit(1);
}

/**
 * Recursively find files matching a pattern
 */
function findFiles(dir, pattern, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    if (statSync(fullPath).isDirectory()) {
      if (item !== 'node_modules') {
        findFiles(fullPath, pattern, files);
      }
    } else if (pattern.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

let args = [];
let testFiles = [];

switch (testType) {
  case 'unit':
    // Unit tests: src/utils/, src/services/, and *.unit.spec.ts in components
    args = ['test', '--spec', '--'];
    testFiles = [
      ...findFiles('src/utils', /\.spec\.ts$/),
      ...findFiles('src/services', /\.spec\.ts$/),
      ...findFiles('src/components', /\.unit\.spec\.ts$/),
    ];
    break;

  case 'component':
    // Component tests: *.spec.tsx files (Stencil rendering tests)
    args = ['test', '--spec', '--'];
    testFiles = findFiles('src/components', /\.spec\.tsx$/);
    break;

  case 'e2e':
    // E2E tests use stencil's --e2e flag
    args = ['test', '--e2e'];
    break;
}

// Build the command
const stencilCmd = process.platform === 'win32' ? 'stencil.cmd' : 'stencil';
const fullArgs = [...args, ...testFiles];

console.log(`Running ${testType} tests...`);
if (testFiles.length > 0) {
  console.log(`Found ${testFiles.length} test file(s)`);
}

// Run stencil test
const child = spawn('npx', [stencilCmd, ...fullArgs], {
  stdio: 'inherit',
  shell: true,
});

child.on('close', code => {
  process.exit(code);
});

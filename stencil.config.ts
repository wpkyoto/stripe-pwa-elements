import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
export const config: Config = {
  namespace: 'stripe-elements',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    sass()
  ],
  testing: {
    /**
     * Test file patterns following Kent Beck's test pyramid:
     * - Unit tests: services, utils, and *.unit.spec.ts files
     * - Component tests: *.spec.tsx files (Stencil rendering tests)
     * - E2E tests: *.e2e.ts files
     */
    testPathIgnorePatterns: ['node_modules'],
  },
};

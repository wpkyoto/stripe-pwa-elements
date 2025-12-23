import { Config } from '@stencil/core';
import { config as baseConfig } from './stencil.config';

/**
 * Stencil configuration for component tests
 * Matches: *.spec.tsx files (Stencil rendering tests)
 */
export const config: Config = {
  ...baseConfig,
  testing: {
    ...baseConfig.testing,
    testRegex: '\\.spec\\.tsx$',
  },
};

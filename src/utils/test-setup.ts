import { i18n } from './i18n';

// Keep snapshot/component tests deterministic regardless of host OS locale.
beforeAll(async () => {
  await i18n.changeLanguage('en');
});


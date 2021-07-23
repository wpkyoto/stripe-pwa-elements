import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

i18next.use(I18nextBrowserLanguageDetector).init({
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {},
    },
    ja: {
      translation: {
        'Pay': '支払う',
        'Failed to load Stripe': 'ライブラリの読み込みに失敗しました。',
        'Add your payment information': '支払情報を追加',
        'Card information': 'カード情報',
        'Card Number': 'カード番号',
        'MM / YY': '月 / 年',
        'CVC': 'セキュリティコード(CVC)',
      },
    },
  },
});

export const i18n = i18next;
export const t = i18next.t;

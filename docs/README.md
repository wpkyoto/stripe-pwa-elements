# stripe-pwa-elements docs

このディレクトリは **Astro + Starlight** で作ったドキュメントサイトです。

## 開発

```bash
npm run docs:dev
```

## ビルド

```bash
npm run docs:build
```

## コンポーネントAPIの同期

`src/components/**/readme.md`（Stencil `docs-readme` 出力）を `docs/src/content/docs/components/` に同期します。

- `docs/package.json` の `sync:components`
- `docs:build` はビルド前に自動で同期します


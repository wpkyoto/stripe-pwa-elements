---
title: Getting Started
description: インストールから最小の利用例まで。
---

## インストール

```bash
npm i stripe-pwa-elements
```

## 利用（HTML）

> この例は「概念の最小」を示します。実運用では Stripe 側で PaymentIntent / SetupIntent を作成して `client_secret` を渡してください。

```html
<stripe-card-element
  publishable-key="pk_test_xxxxx"
  intent-client-secret="pi_xxxxx_secret_xxxxx"
  should-use-default-form-submit-action="false"
></stripe-card-element>
```

## 次に読む

- `Guides` から Intent の扱いやイベント設計を確認
- `Components` から各コンポーネントの Props / Events / Methods を参照

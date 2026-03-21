---
title: Components
description: 各 Web Component の API リファレンス。
---

このセクションは `src/components/**/readme.md`（Stencil の `docs-readme` 出力）を取り込み、Starlight 用のページとして整形したものです。

## コンポーネント選択ガイド

用途に応じて最適なコンポーネントを選択してください。詳しいフロー図は [決済フロー](/guides/payment-flows/) ガイドを参照してください。

| コンポーネント | ユースケース |
| --- | --- |
| [`stripe-card-element`](/components/stripe-card-element/) | カード決済のみ（カード番号・有効期限・CVC を個別表示） |
| [`stripe-card-element-modal`](/components/stripe-card-element-modal/) | カード決済をモーダルで表示 |
| [`stripe-payment-element`](/components/stripe-payment-element/) | 複数の決済手段を統合表示（カード・銀行振込・ウォレットなど） |
| [`stripe-express-checkout-element`](/components/stripe-express-checkout-element/) | Apple Pay / Google Pay / Link のワンクリック決済 |
| [`stripe-link-authentication-element`](/components/stripe-link-authentication-element/) | Stripe Link によるメール認証 |
| [`stripe-address-element`](/components/stripe-address-element/) | 住所の収集 |
| [`stripe-currency-selector`](/components/stripe-currency-selector/) | Adaptive Pricing の通貨選択 |
| [`stripe-modal`](/components/stripe-modal/) | 決済コンポーネントのモーダルラッパー |
| [`stripe-payment-request-button`](/components/stripe-payment-request-button/) | Payment Request API ボタン（Beta） |

---
title: Components
description: Web Component API reference.
---

This section is generated from `src/components/**/readme.md` (Stencil `docs-readme` output) and formatted for Starlight.

## Component Selection Guide

Choose the right component for your use case. See the [Payment Flows](/en/guides/payment-flows/) guide for detailed flow diagrams.

| Component | Use Case |
| --- | --- |
| [`stripe-card-element`](/en/components/stripe-card-element/) | Card-only payments (separate card number, expiry, CVC fields) |
| [`stripe-card-element-modal`](/en/components/stripe-card-element-modal/) | Card payments in a modal |
| [`stripe-payment-element`](/en/components/stripe-payment-element/) | Multiple payment methods in a unified form (cards, bank transfers, wallets, etc.) |
| [`stripe-express-checkout-element`](/en/components/stripe-express-checkout-element/) | One-click payments with Apple Pay / Google Pay / Link |
| [`stripe-link-authentication-element`](/en/components/stripe-link-authentication-element/) | Email authentication with Stripe Link |
| [`stripe-address-element`](/en/components/stripe-address-element/) | Address collection |
| [`stripe-currency-selector`](/en/components/stripe-currency-selector/) | Currency selection for Adaptive Pricing |
| [`stripe-modal`](/en/components/stripe-modal/) | Modal wrapper for payment components |
| [`stripe-payment-request-button`](/en/components/stripe-payment-request-button/) | Payment Request API button (Beta) |

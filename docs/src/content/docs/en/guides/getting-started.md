---
title: Getting Started
description: Install and minimal usage.
---

## Install

```bash
npm i stripe-pwa-elements
```

## Usage (HTML)

> This example shows the minimal concept. In production, create a PaymentIntent/SetupIntent on your server and pass its `client_secret`.

```html
<stripe-card-element
  publishable-key="pk_test_xxxxx"
  intent-client-secret="pi_xxxxx_secret_xxxxx"
  should-use-default-form-submit-action="false"
></stripe-card-element>
```

## Next

- Check `Components` for Props / Events / Methods
- Read `Guides` for intent flows and integration patterns


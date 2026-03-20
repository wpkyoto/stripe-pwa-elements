---
title: <stripe-link-authentication-element>
description: Component API reference.
---

> このページは `src/components/stripe-link-authentication-element/readme.md` から自動生成されています。

## 使用例

### initStripe

Get Stripe.js, and initialize elements

```js
const stripeElement = document.createElement('stripe-link-authentication-element');
customElements
 .whenDefined('stripe-link-authentication-element')
 .then(() => {
   stripeElement.initStripe('pk_test_XXXXXXXXX')
 })
```

### updateProgress

Update the progress status

```js
const stripeElement = document.createElement('stripe-link-authentication-element');
customElements
 .whenDefined('stripe-link-authentication-element')
 .then(() => {
   stripeElement.updateProgress('success')
 })
```

### setErrorMessage

Set error message

```js
const stripeElement = document.createElement('stripe-link-authentication-element');
customElements
 .whenDefined('stripe-link-authentication-element')
 .then(() => {
   stripeElement.setErrorMessage('Invalid email address')
 })
```

### getEmail

Get the current email value from the element

```js
const stripeElement = document.createElement('stripe-link-authentication-element');
customElements
 .whenDefined('stripe-link-authentication-element')
 .then(async () => {
   const email = await stripeElement.getEmail();
   console.log(email);
 })
```

### stripeLoaded

Stripe Client loaded event

```js
const stripeElement = document.createElement('stripe-link-authentication-element');
customElements
 .whenDefined('stripe-link-authentication-element')
 .then(() => {
    stripeElement
     .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {
       console.log('Stripe loaded:', stripe);
     });
  })
```

### linkAuthenticationChange

Link Authentication Element change event

```js
const stripeElement = document.createElement('stripe-link-authentication-element');
customElements
 .whenDefined('stripe-link-authentication-element')
 .then(() => {
    stripeElement
      .addEventListener('linkAuthenticationChange', async ({ detail }) => {
        console.log('Email changed:', detail.email);
      })
  })
```

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                         | Type                                                                     | Default                 |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| `applicationName` | `application-name` | Overwrite the application name that registered For wrapper library (like Capacitor) | `string`                                                                 | `'stripe-pwa-elements'` |
| `defaultEmail`    | `default-email`    | Default email value to prefill the element                                          | `string`                                                                 | `undefined`             |
| `handleChange`    | --                 | Link Authentication Element change handler                                          | `(event: LinkAuthenticationElementChangeEvent) => void \| Promise<void>` | `undefined`             |
| `publishableKey`  | `publishable-key`  | Your Stripe publishable API key.                                                    | `string`                                                                 | `undefined`             |
| `stripeAccount`   | `stripe-account`   | Optional. Making API calls for connected accounts                                   | `string`                                                                 | `undefined`             |
| `stripeDidLoaded` | --                 | Stripe.js class loaded handler                                                      | `(event: StripeLoadedEvent) => Promise<void>`                            | `undefined`             |


## Events

| Event                      | Description                                                                   | Type                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `linkAuthenticationChange` | Link Authentication Element change event Emitted when the email value changes | `CustomEvent<{ stripe: Stripe; linkAuthenticationElement: StripeLinkAuthenticationElement; email?: string; }>` |
| `stripeLoaded`             | Stripe Client loaded event                                                    | `CustomEvent<{ stripe: Stripe; }>`                                                                             |


## Methods

### `getEmail() => Promise<string | undefined>`

Get the current email value from the element

#### Returns

Type: `Promise<string>`

The current email value or undefined

### `initStripe(publishableKey: string, options?: InitStripeOptions) => Promise<void>`

Get Stripe.js, and initialize elements

#### Parameters

| Name             | Type                          | Description |
| ---------------- | ----------------------------- | ----------- |
| `publishableKey` | `string`                      |             |
| `options`        | `{ stripeAccount?: string; }` |             |

#### Returns

Type: `Promise<void>`



### `setErrorMessage(errorMessage: string) => Promise<this>`

Set error message

#### Parameters

| Name           | Type     | Description |
| -------------- | -------- | ----------- |
| `errorMessage` | `string` | string      |

#### Returns

Type: `Promise<this>`



### `updateProgress(progress: ProgressStatus) => Promise<this>`

Update the progress status

#### Parameters

| Name       | Type                                        | Description |
| ---------- | ------------------------------------------- | ----------- |
| `progress` | `"" \| "loading" \| "success" \| "failure"` |             |

#### Returns

Type: `Promise<this>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

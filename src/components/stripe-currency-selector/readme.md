# stripe-currency-selector



<!-- Auto Generated Below -->


## Overview

Stripe Currency Selector Element
Allows customers to select their preferred currency for Adaptive Pricing

## Properties

| Property               | Attribute          | Description                                                                         | Type                                                                  | Default                 |
| ---------------------- | ------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------- |
| `applicationName`      | `application-name` | Overwrite the application name that registered For wrapper library (like Capacitor) | `string`                                                              | `'stripe-pwa-elements'` |
| `clientSecret`         | `client-secret`    | The client secret from Checkout Session Required for Currency Selector Element      | `string`                                                              | `undefined`             |
| `handleCurrencyChange` | --                 | Currency change event handler                                                       | `(event: Event, props: CurrencySelectorChangeEvent) => Promise<void>` | `undefined`             |
| `publishableKey`       | `publishable-key`  | Your Stripe publishable API key.                                                    | `string`                                                              | `undefined`             |
| `stripeAccount`        | `stripe-account`   | Optional. Making API calls for connected accounts                                   | `string`                                                              | `undefined`             |
| `stripeDidLoaded`      | --                 | Stripe.js class loaded handler                                                      | `(event: StripeLoadedEvent) => Promise<void>`                         | `undefined`             |


## Events

| Event            | Description                | Type                                 |
| ---------------- | -------------------------- | ------------------------------------ |
| `currencyChange` | Currency change event      | `CustomEvent<{ currency: string; }>` |
| `stripeLoaded`   | Stripe Client loaded event | `CustomEvent<{ stripe: Stripe; }>`   |


## Methods

### `getSelectedCurrency() => Promise<string | undefined>`

Get the selected currency

#### Returns

Type: `Promise<string>`

Promise resolving to the selected currency code (e.g., 'USD', 'EUR')

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




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

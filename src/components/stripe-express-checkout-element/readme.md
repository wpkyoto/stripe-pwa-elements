# stripe-express-checkout-element

<!-- Auto Generated Below -->


## Overview

Express Checkout Element Component
Provides one-click payment methods (Apple Pay, Google Pay, Link, PayPal, etc.)

## Properties

| Property                        | Attribute                           | Description                                                                                                                                                                | Type                                          | Default                 |
| ------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------- |
| `amount`                        | `amount`                            | Payment amount in cents (e.g., 1099 for $10.99)                                                                                                                            | `number`                                      | `undefined`             |
| `applicationName`               | `application-name`                  | Overwrite the application name that registered For wrapper library (like Capacitor)                                                                                        | `string`                                      | `'stripe-pwa-elements'` |
| `buttonHeight`                  | `button-height`                     | Button height in pixels (e.g., '48px')                                                                                                                                     | `string`                                      | `undefined`             |
| `clientSecret`                  | `client-secret`                     | The client secret from paymentIntent.create or setupIntent.create response                                                                                                 | `string`                                      | `undefined`             |
| `currency`                      | `currency`                          | Three-letter ISO currency code (e.g., 'usd', 'eur')                                                                                                                        | `string`                                      | `undefined`             |
| `intentType`                    | `intent-type`                       | Default submit handle type. If you want to use `setupIntent`, should update this attribute.                                                                                | `"payment" \| "setup"`                        | `'payment'`             |
| `publishableKey`                | `publishable-key`                   | Your Stripe publishable API key.                                                                                                                                           | `string`                                      | `undefined`             |
| `shouldUseDefaultConfirmAction` | `should-use-default-confirm-action` | The component will provide a function to call the confirmation API. If you want to customize the behavior, should set false. And listen the 'confirm' event on the element | `boolean`                                     | `true`                  |
| `stripeAccount`                 | `stripe-account`                    | Optional. Making API calls for connected accounts                                                                                                                          | `string`                                      | `undefined`             |
| `stripeDidLoaded`               | --                                  | Stripe.js class loaded handler                                                                                                                                             | `(event: StripeLoadedEvent) => Promise<void>` | `undefined`             |


## Events

| Event                  | Description                                                                        | Type                                                                                                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cancel`               | Express Checkout cancel event Fired when user cancels the express checkout flow    | `CustomEvent<void>`                                                                                                                                                                                                                        |
| `confirm`              | Express Checkout confirm event Fired when user completes the express checkout flow | `CustomEvent<StripeExpressCheckoutElementConfirmEvent>`                                                                                                                                                                                    |
| `defaultConfirmResult` | Receive the result of default confirm action                                       | `CustomEvent<Error \| { paymentIntent: PaymentIntent; error?: undefined; } \| { paymentIntent?: undefined; error: StripeError; } \| { setupIntent: SetupIntent; error?: undefined; } \| { setupIntent?: undefined; error: StripeError; }>` |
| `expressCheckoutClick` | Express Checkout click event Fired when user clicks on an express checkout button  | `CustomEvent<StripeExpressCheckoutElementClickEvent>`                                                                                                                                                                                      |
| `stripeLoaded`         | Stripe Client loaded event                                                         | `CustomEvent<{ stripe: Stripe; }>`                                                                                                                                                                                                         |


## Methods

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



### `updateElementOptions(options: Partial<ExpressCheckoutElementOptions>) => Promise<this>`

Update element options dynamically

#### Parameters

| Name      | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Description                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `options` | `{ mode?: "payment" \| "subscription" \| "setup"; amount?: number; currency?: string; paymentMethods?: { applePay?: "auto" \| "always" \| "never"; googlePay?: "auto" \| "always" \| "never"; link?: "auto" \| "always" \| "never"; paypal?: "auto" \| "always" \| "never"; amazonPay?: "auto" \| "always" \| "never"; }; buttonType?: { applePay?: "book" \| "buy" \| "check-out" \| "donate" \| "plain" \| "subscribe"; googlePay?: "order" \| "book" \| "buy" \| "donate" \| "plain" \| "subscribe" \| "checkout" \| "pay"; }; buttonTheme?: { applePay?: "black" \| "white" \| "white-outline"; googlePay?: "black" \| "white"; }; buttonHeight?: string \| number; layout?: { maxColumns?: number; maxRows?: number; overflow?: "auto" \| "never"; }; }` | - Partial options to update |

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

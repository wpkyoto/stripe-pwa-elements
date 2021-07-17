# stripe-payment-request-button



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute         | Description                      | Type                                | Default     |
| ----------------- | ----------------- | -------------------------------- | ----------------------------------- | ----------- |
| `publishableKey`  | `publishable-key` | Your Stripe publishable API key. | `string`                            | `undefined` |
| `stripeDidLoaded` | --                | Stripe.js class loaded handler   | `(stripe: Stripe) => Promise<void>` | `undefined` |


## Events

| Event          | Description                | Type                               |
| -------------- | -------------------------- | ---------------------------------- |
| `stripeLoaded` | Stripe Client loaded event | `CustomEvent<{ stripe: Stripe; }>` |


## Methods

### `initStripe(publishableKey: string) => Promise<void>`

Get Stripe.js, and initialize elements

#### Returns

Type: `Promise<void>`



### `setPaymentRequestOption(option: PaymentRequestOptions) => Promise<this>`



#### Returns

Type: `Promise<this>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

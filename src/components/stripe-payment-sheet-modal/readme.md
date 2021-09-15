# stripe-payment-sheet-modal

<!-- Auto Generated Below -->

## Properties

| Property                           | Attribute                               | Description                                                                                                                                                                                 | Type                                                      | Default     |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| `handleSubmit`                     | --                                      | Form submit event handler                                                                                                                                                                   | `(event: Event, props: FormSubmitEvent) => Promise<void>` | `undefined` |
| `intentClientSecret`               | `intent-client-secret`                  | The client secret from paymentIntent.create response                                                                                                                                        | `string`                                                  | `undefined` |
| `intentType`                       | `intent-type`                           | Default submit handle type. If you want to use `setupIntent`, should update this attribute.                                                                                                 | `"payment" \| "setup"`                                    | `'payment'` |
| `open`                             | `open`                                  | Modal state. If true, the modal will open                                                                                                                                                   | `boolean`                                                 | `false`     |
| `publishableKey`                   | `publishable-key`                       | Your Stripe publishable API key.                                                                                                                                                            | `string`                                                  | `undefined` |
| `shouldUseDefaultFormSubmitAction` | `should-use-default-form-submit-action` | The component will provide a function to call the `stripe.confirmCardPayment`API. If you want to customize the behavior, should set false. And listen the 'formSubmit' event on the element | `boolean`                                                 | `true`      |
| `showCloseButton`                  | `show-close-button`                     | If true, the modal display close button                                                                                                                                                     | `boolean`                                                 | `true`      |
| `showLabel`                        | `show-label`                            | Show the form label                                                                                                                                                                         | `boolean`                                                 | `false`     |
| `stripeDidLoaded`                  | --                                      | Stripe.js class loaded handler                                                                                                                                                              | `(event: StripeLoadedEvent) => Promise<void>`             | `undefined` |

## Events

| Event    | Description | Type               |
| -------- | ----------- | ------------------ |
| `closed` |             | `CustomEvent<any>` |

## Methods

### `destroy() => Promise<void>`

#### Returns

Type: `Promise<void>`

### `getStripePaymentSheetElement() => Promise<HTMLStripePaymentElement>`

#### Returns

Type: `Promise<HTMLStripePaymentElement>`

### `present() => Promise<unknown>`

#### Returns

Type: `Promise<unknown>`

### `setPaymentRequestButton(options: PaymentRequestButtonOption) => Promise<void>`

#### Returns

Type: `Promise<void>`

### `updateProgress(progress: ProgressStatus) => Promise<HTMLStripePaymentElement>`

#### Returns

Type: `Promise<HTMLStripePaymentElement>`

## Dependencies

### Depends on

- [stripe-sheet](../stripe-element-modal)
- [stripe-payment](../stripe-payment-sheet)

### Graph

```mermaid
graph TD;
  stripe-payment-sheet --> stripe-sheet
  stripe-payment-sheet --> stripe-payment
  stripe-sheet --> ion-icon
  stripe-payment --> stripe-payment-request-button
  style stripe-payment-sheet fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_

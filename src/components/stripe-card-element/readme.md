# my-component

<!-- Auto Generated Below -->

## Properties

| Property                           | Attribute                               | Description                                                                                                                                                                                 | Type                                                      | Default     |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| `handleSubmit`                     | --                                      | Form submit event handler                                                                                                                                                                   | `(event: Event, props: FormSubmitEvent) => Promise<void>` | `undefined` |
| `paymentIntentClientSecret`        | `payment-intent-client-secret`          | The client secret from paymentIntent.create response                                                                                                                                        | `string`                                                  | `undefined` |
| `publishableKey`                   | `publishable-key`                       | Your Stripe publishable API key.                                                                                                                                                            | `string`                                                  | `undefined` |
| `shouldUseDefaultFormSubmitAction` | `should-use-default-form-submit-action` | The component will provide a function to call the `stripe.confirmCardPayment`API. If you want to customize the behavior, should set false. And listen the 'formSubmit' event on the element | `boolean`                                                 | `true`      |
| `showLabel`                        | `show-label`                            | Show the form label                                                                                                                                                                         | `boolean`                                                 | `false`     |
| `stripeDidLoaded`                  | --                                      | Stripe.js class loaded handler                                                                                                                                                              | `(event: StripeLoadedEvent) => Promise<void>`             | `undefined` |

## Events

| Event                     | Description                                   | Type                                                                                                                                                                            |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultFormSubmitResult` | Recieve the result of defaultFormSubmit event | `CustomEvent<Error \| { paymentIntent: PaymentIntent; error?: undefined; } \| { paymentIntent?: undefined; error: StripeError; }>`                                              |
| `formSubmit`              | Form submit event                             | `CustomEvent<{ stripe: Stripe; cardNumber: StripeCardNumberElement; cardExpiry: StripeCardExpiryElement; cardCVC: StripeCardCvcElement; paymentIntentClientSecret?: string; }>` |
| `stripeLoaded`            | Stripe Client loaded event                    | `CustomEvent<{ stripe: Stripe; }>`                                                                                                                                              |

## Methods

### `initStripe(publishableKey: string) => Promise<void>`

Get Stripe.js, and initialize elements

#### Returns

Type: `Promise<void>`

### `setErrorMessage(errorMessage: string) => Promise<this>`

Set error message

#### Returns

Type: `Promise<this>`

### `updateProgress(progress: ProgressStatus) => Promise<this>`

Update the form submit progress

#### Returns

Type: `Promise<this>`

---

_Built with [StencilJS](https://stenciljs.com/)_

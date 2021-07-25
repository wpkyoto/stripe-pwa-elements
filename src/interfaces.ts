import {
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  PaymentRequestPaymentMethodEvent,
  PaymentRequestShippingOptionEvent,
  PaymentRequestShippingAddressEvent,
} from '@stripe/stripe-js';

/**
 * Event object of `formSubmit` event
 */
export type FormSubmitEvent = {
  stripe: Stripe;
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  cardCVC: StripeCardCvcElement;
  paymentIntentClientSecret?: string;
};
/**
 * Handler function of the `formSubmit` event
 */
export type FormSubmitHandler = (event: Event, props: FormSubmitEvent) => Promise<void>;

/**
 * Event object of `stripeLoaded` event
 */
export type StripeLoadedEvent = {
  stripe: Stripe;
};
/**
 * Handler function of the `stripeLoaded` event
 */
export type StripeDidLoadedHandler = (event: StripeLoadedEvent) => Promise<void>;

/**
 * Activity progress status
 */
export type ProgressStatus = '' | 'loading' | 'success' | 'failure';

export type PaymentRequestPaymentMethodEventHandler = (event: PaymentRequestPaymentMethodEvent, stripe: Stripe) => Promise<void>;
export type PaymentRequestShippingOptionEventHandler = (event: PaymentRequestShippingOptionEvent, stripe: Stripe) => Promise<void>;
export type PaymentRequestShippingAddressEventHandler = (event: PaymentRequestShippingAddressEvent, stripe: Stripe) => Promise<void>;

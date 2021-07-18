import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';

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

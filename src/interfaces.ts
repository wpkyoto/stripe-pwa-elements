import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';

export type FormSubmitHandler = (event: Event, props: FormSubmitEvent) => Promise<void>;
export type StripeDidLoadedHandler = (stripe: Stripe) => Promise<void>;
export type FormSubmitEvent = {
  stripe: Stripe;
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  cardCVC: StripeCardCvcElement;
  paymentIntentClientSecret?: string;
};
export type StripeLoadedEvent = {
  stripe: Stripe;
};

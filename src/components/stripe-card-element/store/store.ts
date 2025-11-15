import { Stripe, StripeElements } from '@stripe/stripe-js';
import { createStore } from '@stencil/store';
import { ProgressStatus } from '../../../interfaces';

export type StripeStoreState = {
  /**
   * Optional. Making API calls for connected accounts
   * @info https://stripe.com/docs/connect/authentication
   */
  stripeAccount?: string;
  /**
   * Your Stripe publishable API key.
   */
  publishableKey?: string;

  /**
   * Status of the Stripe client initilizing process
   */
  loadStripeStatus: ProgressStatus;

  /**
   * Stripe client class
   */
  stripe?: Stripe;

  /**
   * Error message
   */
  errorMessage: string;

  /**
   * Overwrite the application name that registered
   * For wrapper library (like Capacitor)
   */
  applicationName: string;

  elements?: StripeElements;
  el?: HTMLStripeCardElementElement;
};
const stripeStoreInitialState: StripeStoreState = {
  loadStripeStatus: '',
  errorMessage: '',
  applicationName: 'stripe-pwa-elements',
};

export const stripeStore = createStore<StripeStoreState>(stripeStoreInitialState);

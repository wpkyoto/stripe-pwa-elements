import { Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, StripePaymentElement } from '@stripe/stripe-js';
import { ProgressStatus } from '../interfaces';

/**
 * Stripe service state
 */
export type StripeServiceState = {
  publishableKey?: string;
  stripeAccount?: string;
  applicationName: string;
  loadStripeStatus: ProgressStatus;
  stripe?: Stripe;
  elements?: StripeElements;
};

/**
 * Card element instances
 */
export type CardElementInstances = {
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  cardCVC: StripeCardCvcElement;
};

/**
 * Card element state
 */
export type CardElementState = {
  errorMessage: string;
  errorSource?: 'cardNumber' | 'cardExpiry' | 'cardCvc';
};

/**
 * Payment element state
 */
export type PaymentElementState = {
  errorMessage: string;
};

/**
 * Core Stripe service interface
 * Manages Stripe.js initialization and Elements instance
 */
export interface IStripeService {
  /**
   * Get reactive state (for component rendering)
   */
  readonly state: StripeServiceState;

  /**
   * Initialize Stripe.js
   */
  initialize(publishableKey: string, options?: { stripeAccount?: string; applicationName?: string }): Promise<void>;

  /**
   * Register state change listener
   */
  onChange<K extends keyof StripeServiceState>(key: K, callback: (newValue: StripeServiceState[K]) => void): () => void;

  /**
   * Get Stripe instance
   */
  getStripe(): Stripe | undefined;

  /**
   * Get Elements instance
   */
  getElements(): StripeElements | undefined;

  /**
   * Reset service (for testing)
   */
  reset(): void;

  /**
   * Dispose service (cleanup)
   */
  dispose(): void;
}

/**
 * Card Element manager interface
 * Manages card number, expiry, and CVC elements
 */
export interface ICardElementManager {
  /**
   * Get card element state
   */
  getState(): CardElementState;

  /**
   * Initialize and mount card elements
   */
  initialize(containerElement: HTMLElement): Promise<CardElementInstances>;

  /**
   * Get mounted card elements
   */
  getElements(): CardElementInstances | undefined;

  /**
   * Set error message
   */
  setError(message: string): void;

  /**
   * Clear error message
   */
  clearError(): void;

  /**
   * Unmount all card elements
   */
  unmount(): void;
}

/**
 * Payment Element manager interface
 * Manages the unified Stripe Payment Element
 */
export interface IPaymentElementManager {
  /**
   * Get payment element state
   */
  getState(): PaymentElementState;

  /**
   * Initialize and mount payment element
   */
  initialize(containerElement: HTMLElement, options?: { clientSecret?: string }): Promise<StripePaymentElement>;

  /**
   * Get mounted payment element
   */
  getElement(): StripePaymentElement | undefined;

  /**
   * Set error message
   */
  setError(message: string): void;

  /**
   * Clear error message
   */
  clearError(): void;

  /**
   * Unmount payment element
   */
  unmount(): void;
}

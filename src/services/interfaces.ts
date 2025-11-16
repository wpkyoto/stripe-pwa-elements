import { Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, StripeAddressElement } from '@stripe/stripe-js';
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
 * Address element state
 */
export type AddressElementState = {
  errorMessage: string;
  isComplete: boolean;
};

/**
 * Address Element manager interface
 * Manages Stripe Address Element
 */
export interface IAddressElementManager {
  /**
   * Get address element state
   */
  getState(): AddressElementState;

  /**
   * Initialize and mount address element
   */
  initialize(containerElement: HTMLElement, options?: any): Promise<StripeAddressElement>;

  /**
   * Get mounted address element
   */
  getElement(): StripeAddressElement | undefined;

  /**
   * Set error message
   */
  setError(message: string): void;

  /**
   * Clear error message
   */
  clearError(): void;

  /**
   * Unmount address element
   */
  unmount(): void;
}

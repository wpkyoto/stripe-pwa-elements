import {
  Stripe,
  StripeElements,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  StripeExpressCheckoutElement,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementShippingAddressChangeEvent,
  StripeExpressCheckoutElementShippingRateChangeEvent,
} from '@stripe/stripe-js';
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
 * Express Checkout Element options
 */
export type ExpressCheckoutElementOptions = {
  mode?: 'payment' | 'setup' | 'subscription';
  amount?: number;
  currency?: string;
  paymentMethods?: {
    applePay?: 'never' | 'always' | 'auto';
    googlePay?: 'never' | 'always' | 'auto';
    link?: 'never' | 'always' | 'auto';
    paypal?: 'never' | 'always' | 'auto';
    amazonPay?: 'never' | 'always' | 'auto';
  };
  buttonType?: {
    applePay?: 'buy' | 'donate' | 'plain' | 'book' | 'check-out' | 'subscribe';
    googlePay?: 'buy' | 'donate' | 'plain' | 'book' | 'checkout' | 'order' | 'pay' | 'subscribe';
  };
  buttonTheme?: {
    applePay?: 'black' | 'white' | 'white-outline';
    googlePay?: 'black' | 'white';
  };
  buttonHeight?: string;
  layout?: {
    maxColumns?: number;
    maxRows?: number;
    overflow?: 'auto' | 'never';
  };
};

/**
 * Express Checkout Element state
 */
export type ExpressCheckoutElementState = {
  errorMessage: string;
  isReady: boolean;
};

/**
 * Express Checkout Element event handlers
 */
export type ExpressCheckoutElementEventHandlers = {
  onConfirm?: (event: StripeExpressCheckoutElementConfirmEvent) => void | Promise<void>;
  onClick?: (event: StripeExpressCheckoutElementClickEvent) => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onShippingAddressChange?: (event: StripeExpressCheckoutElementShippingAddressChangeEvent) => void | Promise<void>;
  onShippingRateChange?: (event: StripeExpressCheckoutElementShippingRateChangeEvent) => void | Promise<void>;
};

/**
 * Express Checkout Element manager interface
 * Manages Stripe Express Checkout Element
 */
export interface IExpressCheckoutElementManager {
  /**
   * Get express checkout element state
   */
  getState(): ExpressCheckoutElementState;

  /**
   * Initialize and mount express checkout element
   */
  initialize(containerElement: HTMLElement, options: ExpressCheckoutElementOptions, eventHandlers?: ExpressCheckoutElementEventHandlers): Promise<StripeExpressCheckoutElement>;

  /**
   * Get mounted express checkout element
   */
  getElement(): StripeExpressCheckoutElement | undefined;

  /**
   * Update element options
   */
  update(options: Partial<ExpressCheckoutElementOptions>): void;

  /**
   * Set error message
   */
  setError(message: string): void;

  /**
   * Clear error message
   */
  clearError(): void;

  /**
   * Unmount express checkout element
   */
  unmount(): void;
}

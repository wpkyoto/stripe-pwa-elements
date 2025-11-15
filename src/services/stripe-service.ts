import { Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { createStore } from '@stencil/store';
import { loadStripe } from '@stripe/stripe-js';
import { ProgressStatus } from '../interfaces';
import { i18n } from '../utils/i18n';

/**
 * Internal store state for Stripe service
 */
type StripeServiceState = {
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
   * Status of the Stripe client initializing process
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
   * Source of the error (which element type caused it)
   */
  errorSource?: 'cardNumber' | 'cardExpiry' | 'cardCvc';
  /**
   * Overwrite the application name that registered
   * For wrapper library (like Capacitor)
   */
  applicationName: string;
  /**
   * Stripe Elements instance
   */
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
 * Service class for managing Stripe.js state and operations
 * Encapsulates Stencil Store and provides a clean API for components
 */
class StripeServiceClass {
  private store = createStore<StripeServiceState>({
    loadStripeStatus: '',
    errorMessage: '',
    applicationName: 'stripe-pwa-elements',
  });

  private cardElements?: CardElementInstances;
  private changeListeners: Map<string, Array<() => void>> = new Map();

  /**
   * Handle card element errors
   * Only clears error if it's from the same element type
   */
  private handleCardError(elementType: 'cardNumber' | 'cardExpiry' | 'cardCvc') {
    return ({ error }) => {
      if (error) {
        this.store.state.errorMessage = error.message;
        this.store.state.errorSource = elementType;
        return;
      }

      // Only clear error if it originated from the same element
      if (this.store.state.errorSource === elementType) {
        this.store.state.errorMessage = '';
        this.store.state.errorSource = undefined;
      }
    };
  }

  /**
   * Wait for an element to appear in the DOM
   * @param containerElement - Parent element to search in
   * @param selector - CSS selector
   * @param timeout - Timeout in milliseconds (default: 5000ms)
   * @returns Promise that resolves to the found element or rejects on timeout
   */
  private findElement(containerElement: HTMLElement, selector: string, timeout = 5000): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const elem = containerElement.querySelector(selector);
      if (elem) {
        return resolve(elem as HTMLElement);
      }

      const timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
      }, timeout);

      const observer = new MutationObserver(() => {
        const elem = containerElement.querySelector(selector);
        if (elem) {
          clearTimeout(timeoutId);
          observer.disconnect();
          resolve(elem as HTMLElement);
        }
      });

      observer.observe(containerElement, {
        childList: true,
        subtree: true,
      });
    });
  }

  /**
   * Get the reactive state object
   * Components can use this directly in render() for automatic reactivity
   */
  get state() {
    return this.store.state;
  }

  /**
   * Register a callback for when a specific state property changes
   * @param key - The state property to watch
   * @param callback - Function to call when the property changes
   * @returns Unsubscribe function
   */
  onChange<K extends keyof StripeServiceState>(key: K, callback: (newValue: StripeServiceState[K]) => void): () => void {
    const dispose = this.store.onChange(key, callback);

    // Track listeners for cleanup
    if (!this.changeListeners.has(key as string)) {
      this.changeListeners.set(key as string, []);
    }
    this.changeListeners.get(key as string).push(dispose);

    return dispose;
  }

  /**
   * Initialize Stripe.js client
   * @param publishableKey - Your Stripe publishable API key
   * @param options - Optional configuration
   */
  async initialize(publishableKey: string, options?: { stripeAccount?: string; applicationName?: string }) {
    // Update configuration
    this.store.state.publishableKey = publishableKey;
    if (options?.stripeAccount) {
      this.store.state.stripeAccount = options.stripeAccount;
    }
    if (options?.applicationName) {
      this.store.state.applicationName = options.applicationName;
    }

    // If Stripe.js already loaded with same config, do nothing
    if (this.store.state.stripe && this.store.state.publishableKey === publishableKey && this.store.state.stripeAccount === options?.stripeAccount) {
      return;
    }

    this.store.state.loadStripeStatus = 'loading';

    try {
      const stripe = await loadStripe(publishableKey, {
        stripeAccount: options?.stripeAccount,
      });

      // Register app info
      stripe.registerAppInfo({
        name: this.store.state.applicationName,
      });

      this.store.state.stripe = stripe;
      this.store.state.elements = stripe.elements();
      this.store.state.loadStripeStatus = 'success';
    } catch (e) {
      console.error('Failed to load Stripe.js:', e);
      this.store.state.errorMessage = e.message;
      this.store.state.loadStripeStatus = 'failure';
    }
  }

  /**
   * Initialize and mount Stripe card elements
   * @param containerElement - The parent element containing the mount points
   * @returns Promise that resolves to the card element instances
   */
  async initializeCardElements(containerElement: HTMLElement): Promise<CardElementInstances> {
    const elements = this.store.state.elements;

    if (!elements) {
      throw new Error('Stripe Elements not initialized. Call initialize() first.');
    }

    // If already initialized, unmount first
    if (this.cardElements) {
      this.unmountCardElements();
    }

    // Create card number element
    const cardNumber = elements.create('cardNumber', {
      placeholder: i18n.t('Card Number'),
    });
    const cardNumberElement = await this.findElement(containerElement, '#card-number');
    cardNumber.mount(cardNumberElement);
    cardNumber.on('change', this.handleCardError('cardNumber'));

    // Create card expiry element
    const cardExpiry = elements.create('cardExpiry');
    const cardExpiryElement = await this.findElement(containerElement, '#card-expiry');
    cardExpiry.mount(cardExpiryElement);
    cardExpiry.on('change', this.handleCardError('cardExpiry'));

    // Create card CVC element
    const cardCVC = elements.create('cardCvc');
    const cardCVCElement = await this.findElement(containerElement, '#card-cvc');
    cardCVC.mount(cardCVCElement);
    cardCVC.on('change', this.handleCardError('cardCvc'));

    this.cardElements = {
      cardNumber,
      cardExpiry,
      cardCVC,
    };

    return this.cardElements;
  }

  /**
   * Get the current card element instances
   * @returns Card element instances or undefined if not initialized
   */
  getCardElements(): CardElementInstances | undefined {
    return this.cardElements;
  }

  /**
   * Unmount all card elements
   */
  unmountCardElements() {
    if (!this.cardElements) {
      return;
    }

    this.cardElements.cardNumber?.unmount();
    this.cardElements.cardExpiry?.unmount();
    this.cardElements.cardCVC?.unmount();

    this.cardElements = undefined;
  }

  /**
   * Set an error message
   * @param message - The error message to display
   */
  setError(message: string) {
    this.store.state.errorMessage = message;
  }

  /**
   * Clear the error message
   */
  clearError() {
    this.store.state.errorMessage = '';
    this.store.state.errorSource = undefined;
  }

  /**
   * Get the current Stripe instance
   */
  getStripe(): Stripe | undefined {
    return this.store.state.stripe;
  }

  /**
   * Get the current Elements instance
   */
  getElements(): StripeElements | undefined {
    return this.store.state.elements;
  }

  /**
   * Reset the service to initial state
   * Useful for testing and cleanup
   */
  reset() {
    this.unmountCardElements();
    this.store.reset();
  }

  /**
   * Dispose of all listeners and reset state
   * Should be called in test cleanup
   */
  dispose() {
    // Dispose all onChange listeners
    this.changeListeners.forEach(listeners => {
      listeners.forEach(dispose => dispose());
    });
    this.changeListeners.clear();

    // Clean up card elements
    this.unmountCardElements();

    // Dispose the store
    this.store.dispose();
  }
}

/**
 * Singleton instance of StripeService
 * Import this in components to access Stripe functionality
 *
 * @example
 * ```typescript
 * import { StripeService } from '../../services/stripe-service';
 *
 * // In component
 * async connectedCallback() {
 *   await StripeService.initialize('pk_test_...');
 * }
 *
 * render() {
 *   const { errorMessage, loadStripeStatus } = StripeService.state;
 *   // State is automatically reactive
 * }
 * ```
 */
export const StripeService = new StripeServiceClass();

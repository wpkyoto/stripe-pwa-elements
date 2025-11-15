import { Stripe, StripeElements } from '@stripe/stripe-js';
import { createStore } from '@stencil/store';
import { loadStripe } from '@stripe/stripe-js';
import type { IStripeService, StripeServiceState } from './interfaces';

/**
 * Core Stripe Service
 * Manages Stripe.js initialization and Elements instance only
 * Does NOT manage specific element types (Card, Payment, etc.)
 */
class StripeServiceClass implements IStripeService {
  private store = createStore<StripeServiceState>({
    loadStripeStatus: '',
    applicationName: 'stripe-pwa-elements',
  });

  private changeListeners: Map<string, Array<() => void>> = new Map();

  /**
   * Get the reactive state object
   * Components can use this directly in render() for automatic reactivity
   */
  get state(): StripeServiceState {
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
  async initialize(publishableKey: string, options?: { stripeAccount?: string; applicationName?: string }): Promise<void> {
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
      this.store.state.loadStripeStatus = 'failure';
    }
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
  reset(): void {
    this.store.reset();
  }

  /**
   * Dispose of all listeners and reset state
   * Should be called in test cleanup
   */
  dispose(): void {
    // Dispose all onChange listeners
    this.changeListeners.forEach(listeners => {
      listeners.forEach(dispose => dispose());
    });
    this.changeListeners.clear();

    // Dispose the store
    this.store.dispose();
  }
}

/**
 * Singleton instance of StripeService (for backward compatibility)
 * New code should use ServiceFactory for better testability
 *
 * @deprecated Use ServiceFactory.createStripeService() for better DI support
 */
export const StripeService = new StripeServiceClass();

/**
 * Export class for DI usage
 */
export { StripeServiceClass };

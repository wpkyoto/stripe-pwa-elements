import type { IPaymentElementManager, IStripeService, PaymentElementState } from './interfaces';
import { createStore } from '@stencil/store';
import type { StripePaymentElement } from '@stripe/stripe-js';

/**
 * Payment Element Manager
 * Manages Stripe Payment Element (unified payment form)
 * with dependency injection of StripeService
 */
export class PaymentElementManager implements IPaymentElementManager {
  private paymentElement?: StripePaymentElement;
  private store = createStore<PaymentElementState>({
    errorMessage: '',
  });

  /**
   * Constructor with dependency injection
   * @param stripeService - Injected Stripe service instance
   */
  constructor(private stripeService: IStripeService) {}

  /**
   * Get current payment element state (reactive)
   */
  getState(): PaymentElementState {
    return this.store.state;
  }

  /**
   * Initialize and mount payment element to DOM
   * @param containerElement - Parent element containing mount point
   * @param options - Payment element options (clientSecret, etc.)
   * @returns Promise resolving to payment element instance
   */
  async initialize(containerElement: HTMLElement, options?: { clientSecret?: string }): Promise<StripePaymentElement> {
    const elements = this.stripeService.getElements();

    if (!elements) {
      throw new Error('StripeService not initialized. Call StripeService.initialize() first.');
    }

    // Unmount if already initialized
    if (this.paymentElement) {
      this.unmount();
    }

    // Create payment element with options
    const elementOptions: any = {};
    if (options?.clientSecret) {
      elementOptions.clientSecret = options.clientSecret;
    }

    // Create the payment element
    this.paymentElement = elements.create('payment', elementOptions);

    // Find mount point and mount
    const paymentElementContainer = await this.findElement(containerElement, '#payment-element');
    this.paymentElement.mount(paymentElementContainer);

    // Note: Payment Element errors are handled during submission
    // Use setError() method to manually set errors if needed

    return this.paymentElement;
  }

  /**
   * Get mounted payment element instance
   */
  getElement(): StripePaymentElement | undefined {
    return this.paymentElement;
  }

  /**
   * Set error message (triggers reactivity)
   */
  setError(message: string): void {
    this.store.set('errorMessage', message);
  }

  /**
   * Clear error message (triggers reactivity)
   */
  clearError(): void {
    this.store.set('errorMessage', '');
  }

  /**
   * Unmount payment element
   */
  unmount(): void {
    if (!this.paymentElement) {
      return;
    }

    this.paymentElement.unmount();
    this.paymentElement = undefined;
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
}

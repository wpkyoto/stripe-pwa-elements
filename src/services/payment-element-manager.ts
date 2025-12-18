import type { IPaymentElementManager, IStripeService, PaymentElementState } from './interfaces';
import { createStore } from '@stencil/store';
import type { StripePaymentElement, StripePaymentElementOptions } from '@stripe/stripe-js';
import { findElement } from '../utils/element-finder';

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
   * @returns Promise resolving to payment element instance
   */
  async initialize(containerElement: HTMLElement): Promise<StripePaymentElement> {
    const elements = this.stripeService.getElements();

    if (!elements) {
      throw new Error('StripeService not initialized. Call StripeService.initialize() first.');
    }

    // Unmount if already initialized
    if (this.paymentElement) {
      this.unmount();
    }

    // Create payment element with options
    // Note: Payment Element options are typed for better type safety
    const elementOptions: StripePaymentElementOptions = {};

    // Create the payment element
    this.paymentElement = elements.create('payment', elementOptions);

    // Find mount point and mount
    const paymentElementContainer = await findElement(containerElement, '#payment-element');
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
}

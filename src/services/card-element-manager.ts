import type { ICardElementManager, IStripeService, CardElementInstances, CardElementState } from './interfaces';
import { i18n } from '../utils/i18n';
import { createStore } from '@stencil/store';

/**
 * Card Element Manager
 * Manages Stripe Card Elements (cardNumber, cardExpiry, cardCvc)
 * with dependency injection of StripeService
 */
export class CardElementManager implements ICardElementManager {
  private cardElements?: CardElementInstances;
  private store = createStore<CardElementState>({
    errorMessage: '',
    errorSource: undefined,
  });

  /**
   * Constructor with dependency injection
   * @param stripeService - Injected Stripe service instance
   */
  constructor(private stripeService: IStripeService) {}

  /**
   * Get current card element state (reactive)
   */
  getState(): CardElementState {
    return this.store.state;
  }

  /**
   * Initialize and mount card elements to DOM
   * @param containerElement - Parent element containing mount points
   * @returns Promise resolving to card element instances
   */
  async initialize(containerElement: HTMLElement): Promise<CardElementInstances> {
    const elements = this.stripeService.getElements();

    if (!elements) {
      throw new Error('StripeService not initialized. Call StripeService.initialize() first.');
    }

    // Unmount if already initialized
    if (this.cardElements) {
      this.unmount();
    }

    // Create and mount card number element
    const cardNumber = elements.create('cardNumber', {
      placeholder: i18n.t('Card Number'),
    });
    const cardNumberElement = await this.findElement(containerElement, '#card-number');
    cardNumber.mount(cardNumberElement);
    cardNumber.on('change', this.handleCardError('cardNumber'));

    // Create and mount card expiry element
    const cardExpiry = elements.create('cardExpiry');
    const cardExpiryElement = await this.findElement(containerElement, '#card-expiry');
    cardExpiry.mount(cardExpiryElement);
    cardExpiry.on('change', this.handleCardError('cardExpiry'));

    // Create and mount card CVC element
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
   * Get mounted card element instances
   */
  getElements(): CardElementInstances | undefined {
    return this.cardElements;
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
    this.store.set('errorSource', undefined);
  }

  /**
   * Unmount all card elements
   */
  unmount(): void {
    if (!this.cardElements) {
      return;
    }

    this.cardElements.cardNumber?.unmount();
    this.cardElements.cardExpiry?.unmount();
    this.cardElements.cardCVC?.unmount();

    this.cardElements = undefined;
  }

  /**
   * Handle card element errors
   * Only clears error if it's from the same element type
   * Uses store.set() to trigger reactivity
   */
  private handleCardError(elementType: 'cardNumber' | 'cardExpiry' | 'cardCvc') {
    return ({ error }) => {
      if (error) {
        this.store.set('errorMessage', error.message);
        this.store.set('errorSource', elementType);
        return;
      }

      // Only clear error if it originated from the same element
      if (this.store.state.errorSource === elementType) {
        this.store.set('errorMessage', '');
        this.store.set('errorSource', undefined);
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
}

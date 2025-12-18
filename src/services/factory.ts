import type { IStripeService, ICardElementManager, IPaymentElementManager, IAddressElementManager, ICurrencySelectorElementManager } from './interfaces';
import { StripeServiceClass } from './stripe-service';
import { CardElementManager } from './card-element-manager';
import { PaymentElementManager } from './payment-element-manager';
import { AddressElementManager } from './address-element-manager';
import { CurrencySelectorElementManager } from './currency-selector-element-manager';

/**
 * Service Factory
 * Creates service instances with proper dependency injection
 * Can be mocked in tests for better testability
 */
export class ServiceFactory {
  /**
   * Create a new StripeService instance
   */
  createStripeService(): IStripeService {
    return new StripeServiceClass();
  }

  /**
   * Create a new CardElementManager instance
   * @param stripeService - Injected StripeService dependency
   */
  createCardElementManager(stripeService: IStripeService): ICardElementManager {
    return new CardElementManager(stripeService);
  }

  /**
   * Create a new PaymentElementManager instance
   * @param stripeService - Injected StripeService dependency
   */
  createPaymentElementManager(stripeService: IStripeService): IPaymentElementManager {
    return new PaymentElementManager(stripeService);
  }

  /**
   * Create a new AddressElementManager instance
   * @param stripeService - Injected StripeService dependency
   */
  createAddressElementManager(stripeService: IStripeService): IAddressElementManager {
    return new AddressElementManager(stripeService);
  }

  /**
   * Create a new CurrencySelectorElementManager instance
   * @param stripeService - Injected StripeService dependency
   */
  createCurrencySelectorElementManager(stripeService: IStripeService): ICurrencySelectorElementManager {
    return new CurrencySelectorElementManager(stripeService);
  }
}

/**
 * Default factory instance
 * Can be replaced with a mock in tests
 */
export const serviceFactory = new ServiceFactory();

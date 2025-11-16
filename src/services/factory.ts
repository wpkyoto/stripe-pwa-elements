import type { IStripeService, ICardElementManager, IExpressCheckoutElementManager } from './interfaces';
import { StripeServiceClass } from './stripe-service';
import { CardElementManager } from './card-element-manager';
import { ExpressCheckoutElementManager } from './express-checkout-element-manager';

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
   * Create a new ExpressCheckoutElementManager instance
   * @param stripeService - Injected StripeService dependency
   */
  createExpressCheckoutElementManager(stripeService: IStripeService): IExpressCheckoutElementManager {
    return new ExpressCheckoutElementManager(stripeService);
  }
}

/**
 * Default factory instance
 * Can be replaced with a mock in tests
 */
export const serviceFactory = new ServiceFactory();

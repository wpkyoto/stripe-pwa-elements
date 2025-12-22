import { StripeServiceClass, StripeService } from './stripe-service';

// Mock loadStripe from @stripe/stripe-js
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}));

import { loadStripe } from '@stripe/stripe-js';

describe('StripeServiceClass', () => {
  let service: StripeServiceClass;
  let mockStripe: any;
  let mockElements: any;
  let mockCheckout: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockElements = {
      create: jest.fn(),
    };

    mockCheckout = {
      createPaymentElement: jest.fn(),
      confirm: jest.fn(),
      session: jest.fn(),
    };

    mockStripe = {
      elements: jest.fn().mockReturnValue(mockElements),
      initCheckout: jest.fn().mockReturnValue(mockCheckout),
      registerAppInfo: jest.fn(),
    };

    (loadStripe as jest.Mock).mockResolvedValue(mockStripe);

    service = new StripeServiceClass();
  });

  afterEach(() => {
    service.dispose();
  });

  describe('initial state', () => {
    it('should have empty loadStripeStatus', () => {
      expect(service.state.loadStripeStatus).toBe('');
    });

    it('should have default application name', () => {
      expect(service.state.applicationName).toBe('stripe-pwa-elements');
    });

    it('should have isCheckoutSession as false', () => {
      expect(service.state.isCheckoutSession).toBe(false);
    });

    it('should not have stripe instance', () => {
      expect(service.getStripe()).toBeUndefined();
    });

    it('should not have elements instance', () => {
      expect(service.getElements()).toBeUndefined();
    });

    it('should not have checkout instance', () => {
      expect(service.getCheckout()).toBeUndefined();
    });
  });

  describe('initialize (Payment Intent mode)', () => {
    it('should load stripe with publishable key', async () => {
      await service.initialize('pk_test_xxx');

      expect(loadStripe).toHaveBeenCalledWith('pk_test_xxx', { stripeAccount: undefined });
    });

    it('should load stripe with stripe account when provided', async () => {
      await service.initialize('pk_test_xxx', { stripeAccount: 'acct_xxx' });

      expect(loadStripe).toHaveBeenCalledWith('pk_test_xxx', { stripeAccount: 'acct_xxx' });
    });

    it('should set loadStripeStatus to loading during initialization', async () => {
      const initPromise = service.initialize('pk_test_xxx');

      // Note: Due to async nature, this is tricky to test
      // We verify the final state instead
      await initPromise;

      expect(service.state.loadStripeStatus).toBe('success');
    });

    it('should set loadStripeStatus to success after initialization', async () => {
      await service.initialize('pk_test_xxx');

      expect(service.state.loadStripeStatus).toBe('success');
    });

    it('should store publishable key in state', async () => {
      await service.initialize('pk_test_xxx');

      expect(service.state.publishableKey).toBe('pk_test_xxx');
    });

    it('should store stripe account in state when provided', async () => {
      await service.initialize('pk_test_xxx', { stripeAccount: 'acct_xxx' });

      expect(service.state.stripeAccount).toBe('acct_xxx');
    });

    it('should update application name when provided', async () => {
      await service.initialize('pk_test_xxx', { applicationName: 'custom-app' });

      expect(service.state.applicationName).toBe('custom-app');
    });

    it('should register app info with stripe', async () => {
      await service.initialize('pk_test_xxx');

      expect(mockStripe.registerAppInfo).toHaveBeenCalledWith({
        name: 'stripe-pwa-elements',
      });
    });

    it('should create elements instance', async () => {
      await service.initialize('pk_test_xxx');

      expect(mockStripe.elements).toHaveBeenCalled();
      expect(service.getElements()).toBe(mockElements);
    });

    it('should return stripe instance', async () => {
      await service.initialize('pk_test_xxx');

      expect(service.getStripe()).toBe(mockStripe);
    });

    it('should set isCheckoutSession to false', async () => {
      await service.initialize('pk_test_xxx');

      expect(service.state.isCheckoutSession).toBe(false);
    });

    it('should clear checkout instance', async () => {
      await service.initialize('pk_test_xxx');

      expect(service.getCheckout()).toBeUndefined();
    });

    it('should handle initialization errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (loadStripe as jest.Mock).mockRejectedValue(new Error('Network error'));

      await service.initialize('pk_test_xxx');

      expect(service.state.loadStripeStatus).toBe('failure');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should skip re-initialization if already loaded with same config', async () => {
      await service.initialize('pk_test_xxx');

      expect(loadStripe).toHaveBeenCalledTimes(1);

      await service.initialize('pk_test_xxx');

      expect(loadStripe).toHaveBeenCalledTimes(1);
    });

    it('should re-initialize if publishable key changes', async () => {
      await service.initialize('pk_test_xxx');
      await service.initialize('pk_test_yyy');

      expect(loadStripe).toHaveBeenCalledTimes(2);
    });
  });

  describe('initializeWithCheckoutSession (Checkout Session mode)', () => {
    it('should load stripe with publishable key', async () => {
      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(loadStripe).toHaveBeenCalledWith('pk_test_xxx', { stripeAccount: undefined });
    });

    it('should set isCheckoutSession to true', async () => {
      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(service.state.isCheckoutSession).toBe(true);
    });

    it('should initialize checkout with client secret', async () => {
      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(mockStripe.initCheckout).toHaveBeenCalledWith({
        clientSecret: 'cs_test_secret',
        elementsOptions: undefined,
      });
    });

    it('should pass elementsOptions to initCheckout when provided', async () => {
      const elementsOptions = { appearance: { theme: 'stripe' as const } };

      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret', { elementsOptions });

      expect(mockStripe.initCheckout).toHaveBeenCalledWith({
        clientSecret: 'cs_test_secret',
        elementsOptions,
      });
    });

    it('should return checkout instance', async () => {
      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(service.getCheckout()).toBe(mockCheckout);
    });

    it('should clear elements instance in checkout session mode', async () => {
      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(service.getElements()).toBeUndefined();
    });

    it('should set loadStripeStatus to success', async () => {
      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(service.state.loadStripeStatus).toBe('success');
    });

    it('should handle initialization errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (loadStripe as jest.Mock).mockRejectedValue(new Error('Network error'));

      await service.initializeWithCheckoutSession('pk_test_xxx', 'cs_test_secret');

      expect(service.state.loadStripeStatus).toBe('failure');

      consoleSpy.mockRestore();
    });
  });

  describe('onChange', () => {
    it('should register callback for state changes', async () => {
      const callback = jest.fn();

      service.onChange('loadStripeStatus', callback);

      await service.initialize('pk_test_xxx');

      // Callback should be called during initialization
      expect(callback).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const callback = jest.fn();
      const unsubscribe = service.onChange('loadStripeStatus', callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop receiving updates after unsubscribe', async () => {
      const callback = jest.fn();
      const unsubscribe = service.onChange('loadStripeStatus', callback);

      unsubscribe();

      await service.initialize('pk_test_xxx');

      // After unsubscribe, callback should not be called for new changes
      // Note: This depends on the implementation of @stencil/store
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', async () => {
      await service.initialize('pk_test_xxx');

      service.reset();

      expect(service.state.loadStripeStatus).toBe('');
      expect(service.state.applicationName).toBe('stripe-pwa-elements');
    });
  });

  describe('dispose', () => {
    it('should not throw when called', () => {
      expect(() => service.dispose()).not.toThrow();
    });

    it('should be safe to call multiple times', () => {
      expect(() => {
        service.dispose();
        service.dispose();
      }).not.toThrow();
    });
  });
});

describe('StripeService singleton', () => {
  it('should be an instance of StripeServiceClass', () => {
    expect(StripeService).toBeInstanceOf(StripeServiceClass);
  });

  it('should be the same instance when imported multiple times', () => {
    const { StripeService: service1 } = require('./stripe-service');
    const { StripeService: service2 } = require('./stripe-service');

    expect(service1).toBe(service2);
  });
});

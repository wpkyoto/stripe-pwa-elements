import { newSpecPage } from '@stencil/core/testing';
import { StripeCurrencySelector } from '../stripe-currency-selector';
import type { IStripeService, ICurrencySelectorElementManager } from '../../../services/interfaces';
import * as factoryModule from '../../../services/factory';

// Mock loadStripe to avoid actual network calls
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      registerAppInfo: jest.fn(),
      elements: jest.fn(() => ({})),
    }),
  ),
}));

// Mock i18n
jest.mock('../../../utils/i18n', () => ({
  i18n: {
    t: (key: string) => key,
  },
}));

/**
 * Component tests for StripeCurrencySelector
 *
 * Following Kent Beck's test pyramid philosophy:
 * - These tests verify component rendering and DOM interactions
 * - Use newSpecPage for Stencil component context
 * - For pure unit tests, see stripe-currency-selector.unit.spec.ts
 */
describe('stripe-currency-selector component tests', () => {
  // Mock service implementations
  let mockStripeService: jest.Mocked<IStripeService>;
  let mockCurrencySelectorElementManager: jest.Mocked<ICurrencySelectorElementManager>;

  // Set up mocks before each test
  beforeEach(() => {
    // Create fresh mock implementations
    mockStripeService = {
      state: {
        loadStripeStatus: '',
        applicationName: 'stripe-pwa-elements',
        publishableKey: undefined,
        stripeAccount: undefined,
        stripe: undefined,
        elements: undefined,
      },
      initialize: jest.fn().mockResolvedValue(undefined),
      onChange: jest.fn().mockReturnValue(jest.fn()),
      getStripe: jest.fn().mockReturnValue(undefined),
      getElements: jest.fn().mockReturnValue(undefined),
      reset: jest.fn(),
      dispose: jest.fn(),
    } as any;

    mockCurrencySelectorElementManager = {
      getState: jest.fn().mockReturnValue({
        errorMessage: '',
        selectedCurrency: undefined,
      }),
      initialize: jest.fn().mockResolvedValue({} as any),
      getElement: jest.fn().mockReturnValue(undefined),
      setError: jest.fn(),
      clearError: jest.fn(),
      unmount: jest.fn(),
    } as any;

    // Spy on factory methods to return our mocks
    jest.spyOn(factoryModule.serviceFactory, 'createStripeService').mockReturnValue(mockStripeService);
    jest.spyOn(factoryModule.serviceFactory, 'createCurrencySelectorElementManager').mockReturnValue(mockCurrencySelectorElementManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('with the api key', async () => {
      const page = await newSpecPage({
        components: [StripeCurrencySelector],
        html: `<stripe-currency-selector publishable-key='pk_test_xxx'></stripe-currency-selector>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('with client secret', async () => {
      const page = await newSpecPage({
        components: [StripeCurrencySelector],
        html: `<stripe-currency-selector publishable-key='pk_test_xxx' client-secret='cs_test_xxx'></stripe-currency-selector>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should load stripe after setting the publishable-key', async () => {
      const page = await newSpecPage({
        components: [StripeCurrencySelector],
        html: `<stripe-currency-selector></stripe-currency-selector>`,
      });

      // Without publishable-key, the element should still render
      expect(page.root).toBeTruthy();
      page.root.setAttribute('publishable-key', 'yyyy');
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });

    it('should load stripe after setting the publishable-key (snapshot)', async () => {
      const page = await newSpecPage({
        components: [StripeCurrencySelector],
        html: `<stripe-currency-selector></stripe-currency-selector>`,
      });

      page.root.setAttribute('publishable-key', 'yyyy');
      await page.waitForChanges();

      expect(page.root).toMatchSnapshot();
    });
  });
});

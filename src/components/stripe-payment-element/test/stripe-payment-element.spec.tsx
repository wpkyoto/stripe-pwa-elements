import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentElement } from '../stripe-payment-element';
import type { IStripeService, IPaymentElementManager } from '../../../services/interfaces';
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

// Mock service implementations
let mockStripeService: jest.Mocked<IStripeService>;
let mockPaymentElementManager: jest.Mocked<IPaymentElementManager>;

describe('stripe-payment-element', () => {
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

    mockPaymentElementManager = {
      getState: jest.fn().mockReturnValue({
        errorMessage: '',
      }),
      initialize: jest.fn().mockResolvedValue({} as any),
      getElement: jest.fn().mockReturnValue(undefined),
      setError: jest.fn(),
      clearError: jest.fn(),
      unmount: jest.fn(),
    } as any;

    // Spy on factory methods to return our mocks
    jest.spyOn(factoryModule.serviceFactory, 'createStripeService').mockReturnValue(mockStripeService);
    jest.spyOn(factoryModule.serviceFactory, 'createPaymentElementManager').mockReturnValue(mockPaymentElementManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('method test', () => {
    let element: StripePaymentElement = new StripePaymentElement();

    describe('#componentWillRender', () => {
      beforeEach(() => {
        element = new StripePaymentElement();
        element.initStripe = jest.fn();
      });
      it.each([['' as const], ['failure' as const]])('If the publishableKey is not provided, should not call initStripe method(status: %s)', async loadingStatus => {
        mockStripeService.state.loadStripeStatus = loadingStatus;
        element.componentWillRender();
        expect(element.initStripe).toHaveBeenCalledTimes(0);
      });
      it.each([['' as const], ['failure' as const]])('Should call initStripe method when the status is not a part of "success" or "loading" (status: %s)', async loadingStatus => {
        mockStripeService.state.publishableKey = 'pk_test_xxxx';
        mockStripeService.state.loadStripeStatus = loadingStatus;
        element.componentWillRender();
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxxx', {
          stripeAccount: undefined,
        });
      });
      it.each([['success' as const], ['loading' as const]])(
        'Should not call initStripe method when the status is a part of "success" or "loading" (status: %s)',
        async loadingStatus => {
          mockStripeService.state.publishableKey = 'pk_test_xxxx';
          mockStripeService.state.loadStripeStatus = loadingStatus;
          element.componentWillRender();
          expect(element.initStripe).toHaveBeenCalledTimes(0);
        },
      );
    });

    describe('#setErrorMessage', () => {
      beforeEach(() => {
        element = new StripePaymentElement();
      });
      it('should set the certain error message', async () => {
        const message = 'Error message is here';

        await element.setErrorMessage(message);
        expect(mockPaymentElementManager.setError).toHaveBeenCalledWith(message);
      });
    });

    describe('#initStripe', () => {
      beforeEach(() => {
        element = new StripePaymentElement();

        // Mock element.el.querySelector for form submission listener
        const mockFormElement = {
          addEventListener: jest.fn(),
        };
        jest.spyOn(element.el, 'querySelector').mockReturnValue(mockFormElement as any);

        // Mock successful initialization
        mockStripeService.state.loadStripeStatus = 'success';
        mockStripeService.initialize.mockResolvedValue(undefined);
        mockPaymentElementManager.initialize.mockResolvedValue({} as any);
      });

      it('should call stripeService.initialize with correct parameters', async () => {
        await element.initStripe('pk_test_xxx');

        expect(mockStripeService.initialize).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: undefined,
          applicationName: 'stripe-pwa-elements',
        });
      });

      it('should call stripeService.initialize with account id', async () => {
        await element.initStripe('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
        });

        expect(mockStripeService.initialize).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
          applicationName: 'stripe-pwa-elements',
        });
      });
    });

    describe('#updateStripeAccountId', () => {
      beforeEach(() => {
        element = new StripePaymentElement();
        element.initStripe = jest.fn();
        mockStripeService.state.publishableKey = 'pk_test_xxxx';
      });
      it('When call this, should call the #initStripe method only one time', async () => {
        await element.updateStripeAccountId('acct_xxx');
        expect(element.initStripe).toHaveBeenCalledTimes(1);
      });
      it('When call this, should call the #initStripe method with expected props', async () => {
        await element.updateStripeAccountId('acct_xxx');
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxxx', {
          stripeAccount: 'acct_xxx',
        });
      });
    });

    describe('#updatePublishableKey', () => {
      beforeEach(() => {
        element = new StripePaymentElement();
        element.initStripe = jest.fn();
      });
      it('When call this, should call the #initStripe method only one time', async () => {
        await element.updatePublishableKey('pk_test_xxx');
        expect(element.initStripe).toHaveBeenCalledTimes(1);
      });
      it('When call this, should call the #initStripe method with expected props', async () => {
        await element.updatePublishableKey('pk_test_xxx');
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxx', undefined);
      });
      it('When call this, should call the #initStripe method with expected props (with options)', async () => {
        mockStripeService.state.stripeAccount = 'acct_xxx';
        await element.updatePublishableKey('pk_test_xxx');
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
        });
      });
    });
  });

  describe('rendering test', () => {
    it('with the api key and client secret', async () => {
      const page = await newSpecPage({
        components: [StripePaymentElement],
        html: `<stripe-payment-element publishable-key='pk_test_xxx' intent-client-secret='pi_xxx_secret_xxx'></stripe-payment-element>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('with only api key (button should be disabled)', async () => {
      const page = await newSpecPage({
        components: [StripePaymentElement],
        html: `<stripe-payment-element publishable-key='pk_test_xxx'></stripe-payment-element>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should load stripe after setting the publishable-key', async () => {
      const page = await newSpecPage({
        components: [StripePaymentElement],
        html: `<stripe-payment-element></stripe-payment-element>`,
      });

      // Without publishable-key, the form should still render (no failure state)
      expect(page.root.textContent).toContain('Add your payment information');
      page.root.setAttribute('publishable-key', 'pk_test_yyyy');
      await page.waitForChanges();
      expect(page.root.textContent).toContain('Add your payment information');
    });

    it('should load stripe after setting the publishable-key (snapshot)', async () => {
      const page = await newSpecPage({
        components: [StripePaymentElement],
        html: `<stripe-payment-element></stripe-payment-element>`,
      });

      page.root.setAttribute('publishable-key', 'pk_test_yyyy');
      await page.waitForChanges();

      expect(page.root).toMatchSnapshot();
    });
  });
});

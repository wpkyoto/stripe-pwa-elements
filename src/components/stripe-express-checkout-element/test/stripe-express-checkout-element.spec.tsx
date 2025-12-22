import { newSpecPage } from '@stencil/core/testing';
import { StripeExpressCheckoutElement } from '../stripe-express-checkout-element';
import type { IStripeService, IExpressCheckoutElementManager } from '../../../services/interfaces';
import * as factoryModule from '../../../services/factory';

// Mock loadStripe to avoid actual network calls
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      registerAppInfo: jest.fn(),
      elements: jest.fn(() => ({
        create: jest.fn(() => ({
          mount: jest.fn(),
          unmount: jest.fn(),
          on: jest.fn(),
        })),
      })),
      confirmPayment: jest.fn(),
      confirmSetup: jest.fn(),
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
let mockExpressCheckoutManager: jest.Mocked<IExpressCheckoutElementManager>;

describe('stripe-express-checkout-element', () => {
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
        isCheckoutSession: false,
      },
      initialize: jest.fn().mockResolvedValue(undefined),
      initializeWithCheckoutSession: jest.fn().mockResolvedValue(undefined),
      onChange: jest.fn().mockReturnValue(jest.fn()),
      getStripe: jest.fn().mockReturnValue(undefined),
      getElements: jest.fn().mockReturnValue(undefined),
      getCheckout: jest.fn().mockReturnValue(undefined),
      reset: jest.fn(),
      dispose: jest.fn(),
    } as any;

    mockExpressCheckoutManager = {
      getState: jest.fn().mockReturnValue({
        errorMessage: '',
        isReady: false,
      }),
      initialize: jest.fn().mockResolvedValue({} as any),
      getElement: jest.fn().mockReturnValue(undefined),
      update: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
      unmount: jest.fn(),
    } as any;

    // Spy on factory methods to return our mocks
    jest.spyOn(factoryModule.serviceFactory, 'createStripeService').mockReturnValue(mockStripeService);
    jest.spyOn(factoryModule.serviceFactory, 'createExpressCheckoutElementManager').mockReturnValue(mockExpressCheckoutManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('component initialization', () => {
    it('should create component instance', () => {
      const element = new StripeExpressCheckoutElement();

      expect(element).toBeDefined();
    });

    it('should have default intentType of payment', () => {
      const element = new StripeExpressCheckoutElement();

      expect(element.intentType).toBe('payment');
    });

    it('should have default shouldUseDefaultConfirmAction as true', () => {
      const element = new StripeExpressCheckoutElement();

      expect(element.shouldUseDefaultConfirmAction).toBe(true);
    });

    it('should have default applicationName', () => {
      const element = new StripeExpressCheckoutElement();

      expect(element.applicationName).toBe('stripe-pwa-elements');
    });
  });

  describe('method tests', () => {
    let element: StripeExpressCheckoutElement;

    describe('#componentWillUpdate', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
        element.initStripe = jest.fn();
      });

      it('should not call initStripe when publishableKey is not set', () => {
        mockStripeService.state.publishableKey = undefined;
        element.componentWillUpdate();

        expect(element.initStripe).not.toHaveBeenCalled();
      });

      it.each([['success' as const], ['loading' as const]])('should not call initStripe when status is %s', loadingStatus => {
        mockStripeService.state.publishableKey = 'pk_test_xxxx';
        mockStripeService.state.loadStripeStatus = loadingStatus;
        element.componentWillUpdate();

        expect(element.initStripe).not.toHaveBeenCalled();
      });

      it.each([['' as const], ['failure' as const]])('should call initStripe when status is %s', loadingStatus => {
        mockStripeService.state.publishableKey = 'pk_test_xxxx';
        mockStripeService.state.loadStripeStatus = loadingStatus;
        element.componentWillUpdate();

        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxxx', {
          stripeAccount: undefined,
        });
      });
    });

    describe('#setErrorMessage', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
      });

      it('should call manager setError with message', async () => {
        const message = 'Test error message';

        await element.setErrorMessage(message);

        expect(mockExpressCheckoutManager.setError).toHaveBeenCalledWith(message);
      });

      it('should return the element for chaining', async () => {
        const result = await element.setErrorMessage('error');

        expect(result).toBe(element);
      });
    });

    describe('#updateProgress', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
      });

      it('should update progress state to loading', async () => {
        await element.updateProgress('loading');

        expect((element as any).progress).toBe('loading');
      });

      it('should update progress state to success', async () => {
        await element.updateProgress('success');

        expect((element as any).progress).toBe('success');
      });

      it('should update progress state to failure', async () => {
        await element.updateProgress('failure');

        expect((element as any).progress).toBe('failure');
      });

      it('should return the element for chaining', async () => {
        const result = await element.updateProgress('loading');

        expect(result).toBe(element);
      });
    });

    describe('#initStripe', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
        mockStripeService.state.loadStripeStatus = 'success';
      });

      it('should call stripeService.initialize with correct parameters', async () => {
        await element.initStripe('pk_test_xxx');

        expect(mockStripeService.initialize).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: undefined,
          applicationName: 'stripe-pwa-elements',
        });
      });

      it('should call stripeService.initialize with stripe account', async () => {
        await element.initStripe('pk_test_xxx', { stripeAccount: 'acct_xxx' });

        expect(mockStripeService.initialize).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
          applicationName: 'stripe-pwa-elements',
        });
      });
    });

    describe('#updateElementOptions', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
      });

      it('should call manager update with options', async () => {
        await element.updateElementOptions({ amount: 2000 });

        expect(mockExpressCheckoutManager.update).toHaveBeenCalledWith({ amount: 2000 });
      });

      it('should return the element for chaining', async () => {
        const result = await element.updateElementOptions({ amount: 2000 });

        expect(result).toBe(element);
      });
    });

    describe('#updatePublishableKey', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
        element.initStripe = jest.fn();
      });

      it('should call initStripe with new publishable key', async () => {
        await element.updatePublishableKey('pk_test_new');

        expect(element.initStripe).toHaveBeenCalledWith('pk_test_new', undefined);
      });

      it('should include existing stripe account in options', async () => {
        mockStripeService.state.stripeAccount = 'acct_existing';
        await element.updatePublishableKey('pk_test_new');

        expect(element.initStripe).toHaveBeenCalledWith('pk_test_new', {
          stripeAccount: 'acct_existing',
        });
      });
    });

    describe('#updateStripeAccountId', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
        element.initStripe = jest.fn();
        mockStripeService.state.publishableKey = 'pk_test_xxxx';
      });

      it('should call initStripe with new stripe account', async () => {
        await element.updateStripeAccountId('acct_new');

        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxxx', {
          stripeAccount: 'acct_new',
        });
      });
    });

    describe('#disconnectedCallback', () => {
      beforeEach(() => {
        element = new StripeExpressCheckoutElement();
      });

      it('should call manager unmount', () => {
        element.disconnectedCallback();

        expect(mockExpressCheckoutManager.unmount).toHaveBeenCalled();
      });
    });
  });

  describe('rendering tests', () => {
    it('should render loading state when stripe is loading', async () => {
      mockStripeService.state.loadStripeStatus = 'loading';

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      expect(page.root.textContent).toContain('Loading');
    });

    it('should render failure message when stripe fails to load', async () => {
      mockStripeService.state.loadStripeStatus = 'failure';

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      expect(page.root.textContent).toContain('Failed to load Stripe');
    });

    it('should render express checkout container when loaded', async () => {
      mockStripeService.state.loadStripeStatus = 'success';

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      const container = page.root.querySelector('.stripe-express-checkout-wrap');

      expect(container).not.toBeNull();
    });

    it('should render express checkout element mount point', async () => {
      mockStripeService.state.loadStripeStatus = 'success';

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      const mountPoint = page.root.querySelector('#express-checkout-element');

      expect(mountPoint).not.toBeNull();
    });

    it('should render loading indicator when not ready', async () => {
      mockStripeService.state.loadStripeStatus = 'success';
      mockExpressCheckoutManager.getState.mockReturnValue({
        errorMessage: '',
        isReady: false,
      });

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      const loadingDiv = page.root.querySelector('.stripe-express-checkout-loading');

      expect(loadingDiv).not.toBeNull();
    });

    it('should not render loading indicator when ready', async () => {
      mockStripeService.state.loadStripeStatus = 'success';
      mockExpressCheckoutManager.getState.mockReturnValue({
        errorMessage: '',
        isReady: true,
      });

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      const loadingDiv = page.root.querySelector('.stripe-express-checkout-loading');

      expect(loadingDiv).toBeNull();
    });

    it('should render error message when present', async () => {
      mockStripeService.state.loadStripeStatus = 'success';
      mockExpressCheckoutManager.getState.mockReturnValue({
        errorMessage: 'Test error',
        isReady: true,
      });

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      const errorDiv = page.root.querySelector('#express-checkout-errors');

      expect(errorDiv).not.toBeNull();
      expect(errorDiv.textContent).toBe('Test error');
    });

    it('should not render error div when no error', async () => {
      mockStripeService.state.loadStripeStatus = 'success';
      mockExpressCheckoutManager.getState.mockReturnValue({
        errorMessage: '',
        isReady: true,
      });

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element></stripe-express-checkout-element>`,
      });

      const errorDiv = page.root.querySelector('#express-checkout-errors');

      expect(errorDiv).toBeNull();
    });

    it('should render with publishable key and amount', async () => {
      mockStripeService.state.loadStripeStatus = 'success';

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element publishable-key="pk_test_xxx" amount="1099" currency="usd"></stripe-express-checkout-element>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should render in setup mode', async () => {
      mockStripeService.state.loadStripeStatus = 'success';

      const page = await newSpecPage({
        components: [StripeExpressCheckoutElement],
        html: `<stripe-express-checkout-element publishable-key="pk_test_xxx" intent-type="setup"></stripe-express-checkout-element>`,
      });

      expect(page.root).toMatchSnapshot();
    });
  });
});

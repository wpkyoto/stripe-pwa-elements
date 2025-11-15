import { newSpecPage } from '@stencil/core/testing';
import { StripePayment } from '../stripe-payment-sheet';
import { StripeService } from '../../../services/stripe-service';

// Mock loadStripe to avoid actual network calls
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    registerAppInfo: jest.fn(),
    elements: jest.fn(() => ({})),
  })),
}));

// Mock i18n
jest.mock('../../../utils/i18n', () => ({
  i18n: {
    t: (key: string) => key,
  },
}));

describe('stripe-payment', () => {
  describe('method test', () => {
    let element: StripePayment = new StripePayment();

    describe('#componentWillUpdate', () => {
      beforeEach(() => {
        StripeService.dispose();
        element = new StripePayment();
        element.initStripe = jest.fn();
      });
      it.each([['' as const], ['failure' as const]])('If the publishableKey is not provided, should not call initStripe method(status: %s)', async loadingStatus => {
        StripeService.state.loadStripeStatus = loadingStatus;
        element.componentWillUpdate();
        expect(element.initStripe).toHaveBeenCalledTimes(0);
      });
      it.each([['' as const], ['failure' as const]])('Should call initStripe method when the status is not a part of "success" or "loading" (status: %s)', async loadingStatus => {
        StripeService.state.publishableKey = 'pk_test_xxxx';
        StripeService.state.loadStripeStatus = loadingStatus;
        element.componentWillUpdate();
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxxx', {
          stripeAccount: undefined,
        });
      });
      it.each([['success' as const], ['loading' as const]])(
        'Should not call initStripe method when the status is a part of "success" or "loading" (status: %s)',
        async loadingStatus => {
          StripeService.state.publishableKey = 'pk_test_xxxx';
          StripeService.state.loadStripeStatus = loadingStatus;
          element.componentWillUpdate();
          expect(element.initStripe).toHaveBeenCalledTimes(0);
        },
      );
    });
    describe('#setErrorMessage', () => {
      beforeEach(() => {
        StripeService.dispose();
        element = new StripePayment();
      });
      it('should set the certain error message', async () => {
        const message = 'Error message is here';

        await element.setErrorMessage(message);
        expect(StripeService.state.errorMessage).toEqual(message);
      });
    });
    describe('#initStripe', () => {
      beforeEach(() => {
        StripeService.dispose();
        element = new StripePayment();

        // Mock StripeService dependencies to avoid actual Stripe initialization
        jest.spyOn(StripeService, 'initialize').mockResolvedValue();
        jest.spyOn(StripeService, 'initializeCardElements').mockResolvedValue({
          cardNumber: {} as any,
          cardExpiry: {} as any,
          cardCVC: {} as any,
        });
      });

      it('should call StripeService.initialize with correct parameters', async () => {
        const initializeSpy = jest.spyOn(StripeService, 'initialize').mockResolvedValue();

        await element.initStripe('pk_test_xxx');

        expect(initializeSpy).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: undefined,
          applicationName: 'stripe-pwa-elements',
        });
      });

      it('should call StripeService.initialize with account id', async () => {
        const initializeSpy = jest.spyOn(StripeService, 'initialize').mockResolvedValue();

        await element.initStripe('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
        });

        expect(initializeSpy).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
          applicationName: 'stripe-pwa-elements',
        });
      });
    });
    describe('#updateStripeAccountId', () => {
      beforeEach(() => {
        StripeService.dispose();
        element = new StripePayment();
        element.initStripe = jest.fn();
        StripeService.state.publishableKey = 'pk_test_xxxx';
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
        StripeService.dispose();
        element = new StripePayment();
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
        StripeService.state.stripeAccount = 'acct_xxx';
        await element.updatePublishableKey('pk_test_xxx');
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
        });
      });
    });
  });
  describe('rendering test', () => {
    beforeEach(() => {
      StripeService.dispose();
    });
    it('with the api key', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('api key and zip code props', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment zip="false"  publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });
    it('should load stripe after setting the publishable-key', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment></stripe-payment>`,
      });

      // Without publishable-key, the form should still render (no failure state)
      expect(page.root.textContent).toContain('Add your payment information');
      page.root.setAttribute('publishable-key', 'yyyy');
      await page.waitForChanges();
      expect(page.root.textContent).toContain('Add your payment information');
    });
    it('should load stripe after setting the publishable-key (snapshot)', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment zip="false"'></stripe-payment>`,
      });

      page.root.setAttribute('publishable-key', 'yyyy');
      await page.waitForChanges();

      expect(page.root).toMatchSnapshot();
    });
  });
});

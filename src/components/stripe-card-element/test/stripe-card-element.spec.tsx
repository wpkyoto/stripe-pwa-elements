import { newSpecPage } from '@stencil/core/testing';
import { StripeCardElement } from '../stripe-card-element';
import { stripeStore } from '../store';

describe('stripe-card-element', () => {
  describe('method test', () => {
    let element: StripeCardElement = new StripeCardElement();

    describe('#componentWillUpdate', () => {
      beforeEach(() => {
        stripeStore.dispose();
        element = new StripeCardElement();
        element.initStripe = jest.fn();
      });
      it.each([['' as const], ['failure' as const]])('If the publishableKey is not provided, should not call initStripe method(status: %s)', async loadingStatus => {
        stripeStore.set('loadStripeStatus', loadingStatus);
        element.componentWillUpdate();
        expect(element.initStripe).toHaveBeenCalledTimes(0);
      });
      it.each([['' as const], ['failure' as const]])('Should call initStripe method when the status is not a part of "success" or "loading" (status: %s)', async loadingStatus => {
        stripeStore.set('publishableKey', 'pk_test_xxxx');
        stripeStore.set('loadStripeStatus', loadingStatus);
        element.componentWillUpdate();
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxxx', {
          stripeAccount: undefined,
        });
      });
      it.each([['success' as const], ['loading' as const]])(
        'Should not call initStripe method when the status is a part of "success" or "loading" (status: %s)',
        async loadingStatus => {
          stripeStore.set('publishableKey', 'pk_test_xxxx');
          stripeStore.set('loadStripeStatus', loadingStatus);
          element.componentWillUpdate();
          expect(element.initStripe).toHaveBeenCalledTimes(0);
        },
      );
    });
    describe('#setErrorMessage', () => {
      beforeEach(() => {
        stripeStore.dispose();
        element = new StripeCardElement();
      });
      it('should set the certain error message', async () => {
        const message = 'Error message is here';

        await element.setErrorMessage(message);
        expect(stripeStore.get('errorMessage')).toEqual(message);
      });

      it('should handle empty error message', async () => {
        await element.setErrorMessage('');
        expect(stripeStore.get('errorMessage')).toEqual('');
      });

      it('should overwrite previous error message', async () => {
        await element.setErrorMessage('First error');
        expect(stripeStore.get('errorMessage')).toEqual('First error');

        await element.setErrorMessage('Second error');
        expect(stripeStore.get('errorMessage')).toEqual('Second error');
      });

      it('should handle error messages with special characters', async () => {
        const message = 'Error: "Card declined" - <invalid>';

        await element.setErrorMessage(message);
        expect(stripeStore.get('errorMessage')).toEqual(message);
      });

      it('should return the component instance', async () => {
        const result = await element.setErrorMessage('test');
        expect(result).toBe(element);
      });
    });
    describe('#initStripe', () => {
      beforeEach(() => {
        stripeStore.dispose();
        element = new StripeCardElement();
      });
      it('should set expected store state', async () => {
        await element.initStripe('pk_test_xxx');
        expect(stripeStore.state).toMatchObject({
          publishableKey: 'pk_test_xxx',
          errorMessage: '',
          loadStripeStatus: 'loading',
          applicationName: 'stripe-pwa-elements',
        });
      });
      it('should set expected store state with account id', async () => {
        await element.initStripe('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
        });
        expect(stripeStore.state).toMatchObject({
          publishableKey: 'pk_test_xxx',
          errorMessage: '',
          stripeAccount: 'acct_xxx',
          loadStripeStatus: 'loading',
          applicationName: 'stripe-pwa-elements',
        });
      });
      it('should call the onChange event for the loadStripeStatus state', async () => {
        stripeStore.onChange = jest.fn();
        await element.initStripe('pk_test_xxx');
        expect(stripeStore.onChange).toHaveBeenCalledWith('loadStripeStatus', expect.any(Function));
      });
    });
    describe('#updateStripeAccountId', () => {
      beforeEach(() => {
        stripeStore.dispose();
        element = new StripeCardElement();
        element.initStripe = jest.fn();
        stripeStore.set('publishableKey', 'pk_test_xxxx');
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
        stripeStore.dispose();
        element = new StripeCardElement();
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
        stripeStore.set('stripeAccount', 'acct_xxx');
        await element.updatePublishableKey('pk_test_xxx');
        expect(element.initStripe).toHaveBeenCalledWith('pk_test_xxx', {
          stripeAccount: 'acct_xxx',
        });
      });
    });

    describe('#updateProgress', () => {
      beforeEach(() => {
        stripeStore.dispose();
        element = new StripePayment();
      });

      it('should update progress to loading', async () => {
        await element.updateProgress('loading');
        expect(element['progress']).toEqual('loading');
      });

      it('should update progress to success', async () => {
        await element.updateProgress('success');
        expect(element['progress']).toEqual('success');
      });

      it('should update progress to failure', async () => {
        await element.updateProgress('failure');
        expect(element['progress']).toEqual('failure');
      });

      it('should update progress to empty string', async () => {
        element['progress'] = 'loading';
        await element.updateProgress('');
        expect(element['progress']).toEqual('');
      });

      it('should return the component instance', async () => {
        const result = await element.updateProgress('loading');
        expect(result).toBe(element);
      });

      it('should handle rapid progress state changes', async () => {
        await element.updateProgress('loading');
        expect(element['progress']).toEqual('loading');

        await element.updateProgress('success');
        expect(element['progress']).toEqual('success');

        await element.updateProgress('');
        expect(element['progress']).toEqual('');
      });
    });

    describe('#setPaymentRequestOption', () => {
      beforeEach(() => {
        stripeStore.dispose();
        element = new StripePayment();
      });

      it('should set payment request option', async () => {
        const option = {
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Total',
            amount: 1000,
          },
        };

        await element.setPaymentRequestOption(option);
        expect(element['paymentRequestOption']).toEqual(option);
      });

      it('should return the component instance', async () => {
        const option = {
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Total',
            amount: 1000,
          },
        };

        const result = await element.setPaymentRequestOption(option);
        expect(result).toBe(element);
      });
    });
  });
  describe('rendering test', () => {
    beforeEach(() => {
      stripeStore.dispose();
    });
    it('with the api key', async () => {
      const page = await newSpecPage({
        components: [StripeCardElement],
        html: `<stripe-card-element publishable-key='pk_test_xxx'></stripe-card-element>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('api key and zip code props', async () => {
      const page = await newSpecPage({
        components: [StripeCardElement],
        html: `<stripe-card-element zip="false"  publishable-key='pk_test_xxx'></stripe-card-element>`,
      });

      expect(page.root).toMatchSnapshot();
    });
    it('should load stripe after setting the publishable-key', async () => {
      const page = await newSpecPage({
        components: [StripeCardElement],
        html: `<stripe-card-element></stripe-card-element>`,
      });

      expect(page.root.textContent).toContain('Failed to load Stripe');
      page.root.setAttribute('publishable-key', 'yyyy');
      await page.waitForChanges();
      expect(page.root.textContent).not.toContain('Failed to load Stripe');
    });
    it('should load stripe after setting the publishable-key (snapshot)', async () => {
      const page = await newSpecPage({
        components: [StripeCardElement],
        html: `<stripe-card-element zip="false"'></stripe-card-element>`,
      });

      page.root.setAttribute('publishable-key', 'yyyy');
      await page.waitForChanges();

      expect(page.root).toMatchSnapshot();
    });

    it('should render with custom button label', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx' button-label='Add card'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should render with custom sheet title', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx' sheet-title='Add your payment information'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should render with showLabel enabled', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx' show-label="true"></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should render with intentType setup', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx' intent-type='setup'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should render with stripe account', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx' stripe-account='acct_xxx'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it('should disable submit button when progress is loading', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      await page.rootInstance.updateProgress('loading');
      await page.waitForChanges();

      const button = page.root.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button).not.toBeNull();
      expect(button.hasAttribute('disabled') || button.disabled).toBe(true);
    });

    it('should enable submit button when progress is empty', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      await page.rootInstance.updateProgress('');
      await page.waitForChanges();

      const button = page.root.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button).not.toBeNull();
      // Button should not have disabled attribute when progress is empty
      expect(!button.hasAttribute('disabled') || !button.disabled).toBe(true);
    });

    it('should display error message when set', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      await page.rootInstance.setErrorMessage('Card declined');
      await page.waitForChanges();

      const errorElement = page.root.querySelector('.stripe-element-errors');
      expect(errorElement.textContent).toContain('Card declined');
    });

    it('should render zip code field by default', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      const zipInput = page.root.querySelector('#zip');
      expect(zipInput).not.toBeNull();
    });

    it('should not render zip code field when zip is false', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx' zip="false"></stripe-payment>`,
      });

      const zipInput = page.root.querySelector('#zip');
      expect(zipInput).toBeNull();
    });
  });

  describe('props test', () => {
    beforeEach(() => {
      stripeStore.dispose();
    });

    it('should have default intentType as payment', () => {
      const element = new StripePayment();
      expect(element.intentType).toBe('payment');
    });

    it('should have default zip as true', () => {
      const element = new StripePayment();
      expect(element.zip).toBe(true);
    });

    it('should have default buttonLabel as Pay', () => {
      const element = new StripePayment();
      expect(element.buttonLabel).toBe('Pay');
    });

    it('should have default applicationName', () => {
      const element = new StripePayment();
      expect(element.applicationName).toBe('stripe-pwa-elements');
    });

    it('should have default showLabel as false', () => {
      const element = new StripePayment();
      expect(element.showLabel).toBe(false);
    });

    it('should have default shouldUseDefaultFormSubmitAction as true', () => {
      const element = new StripePayment();
      expect(element.shouldUseDefaultFormSubmitAction).toBe(true);
    });
  });
});

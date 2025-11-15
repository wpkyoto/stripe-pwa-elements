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
  });
});

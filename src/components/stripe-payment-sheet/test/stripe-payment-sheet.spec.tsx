import { newSpecPage } from '@stencil/core/testing';
import { StripePayment } from '../stripe-payment-sheet';
import { stripeStore } from '../store';

describe('stripe-payment', () => {
  describe('rendering test', () => {
    beforeEach(() => {
      stripeStore.dispose();
    });
    it('with the api key', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment publishable-key='pk_test_xxx'></stripe-payment>`,
      });
  
      expect(page.root).toMatchSnapshot()
    });
    it('api key and zip code props', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment zip="false"  publishable-key='pk_test_xxx'></stripe-payment>`,
      });

      expect(page.root).toMatchSnapshot()
    });
    it('api key and zip code props', async () => {
      const page = await newSpecPage({
        components: [StripePayment],
        html: `<stripe-payment zip="false"'></stripe-payment>`,
      });

      stripeStore.set('publishableKey','pk_test_xxx')
      stripeStore.state.publishableKey = 'pk_test_xxx'
      expect(page.root).toMatchSnapshot()
    });

  })
});

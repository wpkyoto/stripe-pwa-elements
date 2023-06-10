import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentElement } from '../stripe-payment-element';

describe('stripe-payment-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentElement],
      html: `<stripe-payment-element></stripe-payment-element>`,
    });
    expect(page.root).toMatchSnapshot()
  });
});

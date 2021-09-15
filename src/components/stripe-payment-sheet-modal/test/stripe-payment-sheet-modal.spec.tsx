import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentSheet } from '../stripe-payment-sheet-modal';

describe('stripe-payment-sheet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    expect(page.root).toMatchSnapshot();
  });
});

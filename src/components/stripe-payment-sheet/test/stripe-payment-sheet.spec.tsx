import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentSheet } from '../stripe-payment-sheet';

describe('stripe-payment-sheet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });
    expect(page.root).toEqualHtml(`
      <stripe-payment-sheet>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </stripe-payment-sheet>
    `);
  });
});

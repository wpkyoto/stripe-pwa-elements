import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentRequestButton } from '../stripe-payment-request-button';

describe('stripe-payment-request-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentRequestButton],
      html: `<stripe-payment-request-button></stripe-payment-request-button>`,
    });
    expect(page.root).toEqualHtml(`
      <stripe-payment-request-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </stripe-payment-request-button>
    `);
  });
});

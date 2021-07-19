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
        <div id="payment-request">
            <div id="payment-request-button"></div>
        </div>
      </stripe-payment-request-button>
    `);
  });
});

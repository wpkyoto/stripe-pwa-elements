import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentSheetModal } from '../stripe-payment-sheet-modal';

describe('stripe-payment-sheet-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheetModal],
      html: `<stripe-payment-sheet-modal></stripe-payment-sheet-modal>`,
    });

    expect(page.root).toMatchSnapshot()
  });
});

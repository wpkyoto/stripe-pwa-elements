import { newE2EPage } from '@stencil/core/testing';

describe('stripe-payment-sheet-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<stripe-payment-sheet-modal></stripe-payment-sheet-modal>');

    const element = await page.find('stripe-payment-sheet-modal');
    expect(element).toHaveClass('hydrated');
  });
});

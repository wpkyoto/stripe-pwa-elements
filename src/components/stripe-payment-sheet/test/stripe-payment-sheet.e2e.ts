import { newE2EPage } from '@stencil/core/testing';

describe('stripe-payment-sheet', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<stripe-payment-sheet></stripe-payment-sheet>');

    const element = await page.find('stripe-payment-sheet');
    expect(element).toHaveClass('hydrated');
  });
});

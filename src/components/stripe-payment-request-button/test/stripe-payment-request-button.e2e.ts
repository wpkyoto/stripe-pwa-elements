import { newE2EPage } from '@stencil/core/testing';

describe('stripe-payment-request-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<stripe-payment-request-button></stripe-payment-request-button>');

    const element = await page.find('stripe-payment-request-button');

    expect(element).toHaveClass('hydrated');
  });
});

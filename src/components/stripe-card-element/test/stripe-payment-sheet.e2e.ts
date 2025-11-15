import { newE2EPage } from '@stencil/core/testing';

describe('stripe-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<stripe-payment></stripe-payment>');

    const element = await page.find('stripe-payment');

    expect(element).toHaveClass('hydrated');
  });
});

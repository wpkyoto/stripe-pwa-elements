import { newE2EPage } from '@stencil/core/testing';

describe('stripe-element-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<stripe-element-modal></stripe-element-modal>');

    const element = await page.find('stripe-element-modal');

    expect(element).toHaveClass('hydrated');
  });
});

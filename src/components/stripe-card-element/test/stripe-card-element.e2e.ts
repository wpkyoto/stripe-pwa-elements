import { newE2EPage } from '@stencil/core/testing';

describe('stripe-card-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<stripe-card-element></stripe-card-element>');
    const element = await page.find('stripe-card-element');

    expect(element).toHaveClass('hydrated');
  });
});

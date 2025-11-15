import { newE2EPage } from '@stencil/core/testing';

describe('stripe-sheet', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<stripe-sheet></stripe-sheet>');

    const element = await page.find('stripe-sheet');

    expect(element).toHaveClass('hydrated');
  });
});

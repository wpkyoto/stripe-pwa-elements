import { newSpecPage } from '@stencil/core/testing';
import { StripeElementModal } from '../stripe-element-modal';

describe('stripe-element-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripeElementModal],
      html: `<stripe-element-modal></stripe-element-modal>`,
    });

    expect(page.root).toEqualHtml(`
      <stripe-element-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </stripe-element-modal>
    `);
  });
});

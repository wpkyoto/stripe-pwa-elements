import { newSpecPage } from '@stencil/core/testing';
import { StripeElementModal } from '../stripe-element-modal';

describe('stripe-element-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripeElementModal],
      html: `<stripe-element-modal></stripe-element-modal>`,
    });

    expect(page.root).toEqualHtml(`
    <stripe-element-modal class="undefined">
      <mock:shadow-root>
        <div class="modal-row">
          <div class="modal-child">
            <div class="modal-close-button-wrap">
              <ion-icon class="modal-close-button" name="close" size="large"></ion-icon>
            </div>
            <slot></slot>
          </div>
        </div>
      </mock:shadow-root>
    </stripe-element-modal>
    `);
  });
});

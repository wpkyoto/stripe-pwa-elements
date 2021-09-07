import { newSpecPage } from '@stencil/core/testing';
import { StripeSheet } from '../stripe-element-modal';

describe('stripe-sheet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripeSheet],
      html: `<stripe-sheet></stripe-sheet>`,
    });

    expect(page.root).toEqualHtml(`
    <stripe-sheet class="undefined">
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
    </stripe-sheet>
    `);
  });
});

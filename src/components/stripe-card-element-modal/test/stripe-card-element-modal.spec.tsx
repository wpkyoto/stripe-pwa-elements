import { newSpecPage } from '@stencil/core/testing';
import { StripeCardElementModal } from '../stripe-card-element-modal';

describe('stripe-card-element-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripeCardElementModal],
      html: `<stripe-card-element-modal></stripe-card-element-modal>`,
    });

    expect(page.root).toEqualHtml(`<stripe-card-element-modal>
      <stripe-modal showclosebutton="">
        <stripe-card-element intenttype="payment" shouldusedefaultformsubmitaction="" zip=""></stripe-card-element>
      </stripe-modal>
    </stripe-card-element-modal>`);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { StripeCardElement } from '../stripe-card-element';

describe('my-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [StripeCardElement],
      html: '<stripe-card-element></stripe-card-element>',
    });

    expect(root).toEqualHtml(`
<stripe-card-element class="undefined">
      <div class="stripe-payment-wrap">
        <form id="stripe-card-element">
          <div class="stripe-heading">
            Add your payment information
          </div>
          <div>
            <div class="stripe-section-title">
              Card information
            </div>
          </div>
          <div class="card payment-info visible">
            <fieldset class="stripe-input-box">
              <div>
                <label>
                  <div id="card-number"></div>
                </label>
              </div>
              <div class="stripe-input-column" style="display: flex;">
                <label style="width: 50%;">
                  <div id="card-expiry"></div>
                </label>
                <label style="width: 50%;">
                  <div id="card-cvc"></div>
                </label>
              </div>
            </fieldset>
          </div>
          <div style="margin-top: 32px;">
            <button type="submit">
              Pay
            </button>
          </div>
        </form>
      </div>
    </stripe-card-element>
    `);
  });
});

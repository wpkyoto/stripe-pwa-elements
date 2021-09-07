import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentSheet } from '../stripe-payment-sheet';

describe('stripe-payment-sheet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    expect(page.root).toEqualHtml(`
 <stripe-payment-sheet class="undefined">
      <div class="stripe-payment-sheet-wrap">
        <form id="stripe-card-element">
          <div class="stripe-heading">
            Add your payment information
          </div>
          <div id="stripe-payment-request-button"></div>
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
              <div class="element-errors" id="card-errors"></div>
            </fieldset>
          </div>
          <div style="margin-top: 1.5rem;">
            <div class="stripe-section-title">
              Country or region
            </div>
          </div>
          <div class="card payment-info visible">
            <fieldset class="stripe-input-box">
              <div>
                <label>
                  <input class="StripeElement stripe-input-box" id="zip" inputmode="numeric" name="zip" placeholder="Postal Code" type="text" style="width: 100%;">
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
    </stripe-payment-sheet>
    `);
  });
});

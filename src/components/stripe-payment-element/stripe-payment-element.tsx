import { Component, Host, h, Element } from '@stencil/core';
import { Prop } from '@stencil/core/internal';
import { loadStripe } from "@stripe/stripe-js";
import { waitForElm } from '../../utils/utils';

@Component({
  tag: 'stripe-payment-element',
  shadow: false,
})
export class StripePaymentElement {
  @Element() el: HTMLStripePaymentElement;
  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  constructor() {
    if (this.publishableKey) {
        loadStripe(this.publishableKey)
          .then(async stripe => {
            if (!stripe) return
            const elements = stripe.elements({
              mode: 'payment',
              amount: 1000,
              currency: 'jpy'
            })
            const paymentElement = elements.create('payment')
            const target = await waitForElm(this.el, '#payment-element')
            paymentElement.mount(target)
          })
    }
  }

  render() {
    return (
      <Host>
        <div id="payment-element"></div>
      </Host>
    );
  }

}

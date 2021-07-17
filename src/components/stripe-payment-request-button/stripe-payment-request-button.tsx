import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'stripe-payment-request-button',
  styleUrl: 'stripe-payment-request-button.css',
  shadow: true,
})
export class StripePaymentRequestButton {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}

import { Component, Prop, h, State, Method, EventEmitter, Event, Host, Element } from '@stencil/core';
import { loadStripe, Stripe, PaymentRequestOptions } from '@stripe/stripe-js';
import { StripeDidLoadedHandler, StripeLoadedEvent } from '../../interfaces';

@Component({
  tag: 'stripe-payment-request-button',
  styleUrl: 'stripe-payment-request-button.css',
  shadow: false,
})
export class StripePaymentRequestButton {
  @Element() el: HTMLStripePaymentRequestButtonElement;
  @State() loadStripeStatus: '' | 'loading' | 'success' | 'failure' = '';

  @State() stripe: Stripe;

  @State() paymentRequestOption?: PaymentRequestOptions;

  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  /**
   * Stripe.js class loaded handler
   */
  @Prop({
    mutable: true,
  })
  stripeDidLoaded?: StripeDidLoadedHandler;
  /**
   * Stripe Client loaded event
   * @example
   * ```
   * stripeElement
   *  .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {
   *   stripe
   *     .createSource({
   *       type: 'ideal',
   *       amount: 1099,
   *       currency: 'eur',
   *       owner: {
   *         name: 'Jenny Rosen',
   *       },
   *       redirect: {
   *         return_url: 'https://shop.example.com/crtA6B28E1',
   *       },
   *     })
   *     .then(function(result) {
   *       // Handle result.error or result.source
   *     });
   *   });
   * ```
   */
  @Event() stripeLoaded: EventEmitter<StripeLoadedEvent>;

  private stripeLoadedEventHandler() {
    const event: StripeLoadedEvent = {
      stripe: this.stripe,
    };

    if (this.stripeDidLoaded) {
      this.stripeDidLoaded(event);
    }

    this.stripeLoaded.emit(event);
  }

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey);
    } else {
      this.loadStripeStatus = 'failure';
    }
  }

  /**
   * @param option
   * @private
   */
  @Method()
  public async setPaymentRequestOption(option: PaymentRequestOptions) {
    this.paymentRequestOption = option;
    return this;
  }

  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   */
  @Method()
  public async initStripe(publishableKey: string) {
    this.loadStripeStatus = 'loading';
    loadStripe(publishableKey)
      .then(stripe => {
        this.loadStripeStatus = 'success';
        this.stripe = stripe;
        return;
      })
      .catch(e => {
        console.log(e);
        this.loadStripeStatus = 'failure';
        return;
      })
      .then(() => {
        if (!this.stripe) {
          return;
        }

        return this.initElement();
      })
      .then(() => {
        if (!this.stripe) {
          return;
        }

        this.stripeLoadedEventHandler();
      });
  }

  /**
   * Initialize Component using Stripe Element
   */
  private async initElement() {
    const elements = this.stripe.elements();
    const paymentRequest = this.stripe.paymentRequest(this.paymentRequestOption);
    const paymentRequestButton = elements.create('paymentRequestButton', {
      paymentRequest,
    });
    const paymentRequestButtonElement = document.getElementById('payment-request-button');
    // Check if the Payment Request is available (or Apple Pay on the Web).
    const paymentRequestSupport = await paymentRequest.canMakePayment();

    if (paymentRequestSupport) {
      // Display the Pay button by mounting the Element in the DOM.
      paymentRequestButton.mount(paymentRequestButtonElement);
      // Show the payment request section.
      document.getElementById('payment-request').classList.add('visible');
    }
  }

  render() {
    return (
      <Host>
        <div id="payment-request">
          <div id="payment-request-button"></div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}

import { Component, Prop, h, State, Method, EventEmitter, Event, Host, Element } from '@stencil/core';
import { loadStripe, Stripe, PaymentRequestOptions } from '@stripe/stripe-js';
import {
  StripeDidLoadedHandler,
  StripeLoadedEvent,
  PaymentRequestShippingAddressEventHandler,
  PaymentRequestPaymentMethodEventHandler,
  PaymentRequestShippingOptionEventHandler,
} from '../../interfaces';

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
   * Set handler of the `paymentRequest.on('paymentmethod'` event.
   * @example
   * ```
   *  element.setPaymentMethodEventHandler(async (event, stripe) => {
   * // Confirm the PaymentIntent with the payment method returned from the payment request.
   *   const {error} = await stripe.confirmCardPayment(
   *     paymentIntent.client_secret,
   *     {
   *      payment_method: event.paymentMethod.id,
   *      shipping: {
   *        name: event.shippingAddress.recipient,
   *        phone: event.shippingAddress.phone,
   *        address: {
   *          line1: event.shippingAddress.addressLine[0],
   *          city: event.shippingAddress.city,
   *          postal_code: event.shippingAddress.postalCode,
   *          state: event.shippingAddress.region,
   *          country: event.shippingAddress.country,
   *        },
   *      },
   *    },
   *    {handleActions: false}
   *  );
   * ```
   */
  @Prop() paymentMethodEventHandler?: PaymentRequestPaymentMethodEventHandler;

  /**
   * Register event handler for `paymentRequest.on('paymentmethod'` event.
   */
  @Method()
  public async setPaymentMethodEventHandler(handler: PaymentRequestPaymentMethodEventHandler) {
    this.paymentMethodEventHandler = handler;
  }

  /**
   * Set handler of the `paymentRequest.on('shippingoptionchange')` event
   * @example
   * ```
   *  element.setPaymentRequestShippingOptionEventHandler(async (event, stripe) => {
   *   event.updateWith({status: 'success'});
   *  })
   * ```
   */
  @Prop() shippingOptionEventHandler?: PaymentRequestShippingOptionEventHandler;
  
  /**
   * Register event handler for `paymentRequest.on('shippingoptionchange'` event.
   */
  @Method()
  public async setPaymentRequestShippingOptionEventHandler(handler: PaymentRequestShippingOptionEventHandler) {
    this.shippingOptionEventHandler = handler;
  }

  /**
   * Set handler of the `paymentRequest.on('shippingaddresschange')` event
   * @example
   * ```
   *  element.setPaymentRequestShippingAddressEventHandler(async (event, stripe) => {
   *   const response = await store.updatePaymentIntentWithShippingCost(
   *     paymentIntent.id,
   *     store.getLineItems(),
   *     event.shippingOption
   *   );
   *  })
   * ```
   */
  @Prop() shippingAddressEventHandler?: PaymentRequestShippingAddressEventHandler;
  
  /**
   * Register event handler for `paymentRequest.on('shippingaddresschange'` event.
   */
  @Method()
  public async setPaymentRequestShippingAddressEventHandler(handler: PaymentRequestShippingAddressEventHandler) {
    this.shippingAddressEventHandler = handler;
  }

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
    const paymentRequestButtonElement: HTMLElement = this.el.querySelector('#payment-request-button');
    // Check if the Payment Request is available (or Apple Pay on the Web).
    const paymentRequestSupport = await paymentRequest.canMakePayment();

    if (paymentRequestSupport) {
      // Display the Pay button by mounting the Element in the DOM.
      paymentRequestButton.mount(paymentRequestButtonElement);
      // Show the payment request section.
      this.el.querySelector('#payment-request').classList.add('visible');

      if (this.paymentMethodEventHandler) {
        paymentRequest.on('paymentmethod', event => {
          this.paymentMethodEventHandler(event, this.stripe);
        });
      }

      if (this.shippingOptionEventHandler) {
        paymentRequest.on('shippingoptionchange', event => {
          this.shippingOptionEventHandler(event, this.stripe);
        });
      }

      if (this.shippingAddressEventHandler) {
        paymentRequest.on('shippingaddresschange', event => {
          this.shippingAddressEventHandler(event, this.stripe);
        });
      }
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

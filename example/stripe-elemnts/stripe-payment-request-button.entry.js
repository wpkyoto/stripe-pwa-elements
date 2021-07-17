import { r as registerInstance, f as createEvent, i as h, j as Host, k as getElement } from './index-4a7881a4.js';
import { l as loadStripe } from './stripe.esm-6506eb95.js';

const stripePaymentRequestButtonCss = ":host{display:block}";

const StripePaymentRequestButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.stripeLoaded = createEvent(this, "stripeLoaded", 7);
    this.loadStripeStatus = '';
    if (this.publishableKey) {
      this.initStripe(this.publishableKey);
    }
    else {
      this.loadStripeStatus = 'failure';
    }
  }
  stripeLoadedEventHandler() {
    const event = {
      stripe: this.stripe,
    };
    if (this.stripeDidLoaded) {
      this.stripeDidLoaded(event);
    }
    this.stripeLoaded.emit(event);
  }
  async setPaymentRequestOption(option) {
    this.paymentRequestOption = option;
    return this;
  }
  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   */
  async initStripe(publishableKey) {
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
      if (!this.stripe)
        return;
      return this.initElement();
    })
      .then(() => {
      if (!this.stripe)
        return;
      this.stripeLoadedEventHandler();
    });
  }
  /**
   * Initialize Component using Stripe Element
   */
  async initElement() {
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
    return (h(Host, null, h("div", { id: "payment-request" }, h("div", { id: "payment-request-button" })), h("slot", null)));
  }
  get el() { return getElement(this); }
};
StripePaymentRequestButton.style = stripePaymentRequestButtonCss;

export { StripePaymentRequestButton as stripe_payment_request_button };

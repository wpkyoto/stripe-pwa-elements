import { Component, Prop, h, State, Method, EventEmitter, Event } from '@stencil/core';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';

export type FormSubmitHandler = (event: Event, props: FormSubmitEvent) => Promise<void>;
export type StripeDidLoadedHandler = (stripe: Stripe) => Promise<void>;

export type FormSubmitEvent = {
  stripe: Stripe;
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  cardCVC: StripeCardCvcElement;
};
export type StripeLoadedEvent = {
  stripe: Stripe;
};

@Component({
  tag: 'stripe-card-element',
  styleUrl: 'stripe-card-element.css',
  shadow: false,
})
export class MyComponent {
  @State() loadStripeStatus: '' | 'loading' | 'success' | 'failure' = '';

  @State() stripe: Stripe;

  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  @Prop() showLabel: boolean = false;

  @Prop({
    mutable: true,
  })
  handleSubmit?: FormSubmitHandler;

  @Prop({
    mutable: true,
  })
  stripeDidLoaded?: StripeDidLoadedHandler;

  @Event() stripeLoaded: EventEmitter<StripeLoadedEvent>;
  stripeLoadedEventHandler() {
    if (this.stripeDidLoaded) {
      this.stripeDidLoaded(this.stripe);
    }
    this.stripeLoaded.emit({ stripe: this.stripe });
  }

  @Event() formSubmit: EventEmitter<FormSubmitEvent>;
  formSubmitEventHandler() {
    const { cardCVC, cardExpiry, cardNumber, stripe } = this;
    this.formSubmit.emit({
      cardCVC,
      cardExpiry,
      cardNumber,
      stripe,
    });
  }

  private cardNumber!: StripeCardNumberElement;
  private cardExpiry!: StripeCardExpiryElement;
  private cardCVC!: StripeCardCvcElement;

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey);
    }
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
        if (!this.stripe) return;
        return this.initElement();
      })
      .then(() => {
        if (!this.stripe) return;
        this.stripeLoadedEventHandler();
      });
  }

  /**
   * Initialize Component using Stripe Element
   */
  private async initElement() {
    const elements = this.stripe.elements();
    const cardErrorElement = document.getElementById('card-errors');
    const handleCardError = ({ error }) => {
      if (error) {
        cardErrorElement.textContent = error.message;
        cardErrorElement.classList.add('visible');
      } else {
        cardErrorElement.classList.remove('visible');
      }
    };

    this.cardNumber = elements.create('cardNumber', {
      placeholder: 'Card number',
    });
    const cardNumberElement = document.getElementById('card-number');
    this.cardNumber.mount(cardNumberElement);
    this.cardNumber.on('change', handleCardError);

    this.cardExpiry = elements.create('cardExpiry');
    const cardExpiryElement = document.getElementById('card-expiry');
    this.cardExpiry.mount(cardExpiryElement);
    this.cardExpiry.on('change', handleCardError);

    this.cardCVC = elements.create('cardCvc');
    const cardCVCElement = document.getElementById('card-cvc');
    this.cardCVC.mount(cardCVCElement);
    this.cardCVC.on('change', handleCardError);

    document.getElementById('stripe-card-element').addEventListener('submit', e => {
      if (this.handleSubmit) {
        const { cardCVC, cardExpiry, cardNumber, stripe } = this;
        this.handleSubmit(e, { cardCVC, cardExpiry, cardNumber, stripe });
      }
      e.preventDefault();
      this.formSubmitEventHandler();
    });
  }

  render() {
    if (this.loadStripeStatus === 'failure') {
      return <p>Failed to load Stripe</p>;
    }

    return (
      <form id="stripe-card-element">
        <h1>Add your payment information</h1>
        <div>
          <h2>Card information</h2>
        </div>
        <div class="payment-info card visible">
          <fieldset>
            <div>
              <label>
                {this.showLabel ? <lenged>Card Number</lenged> : null}
                <div id="card-number" />
              </label>
            </div>
            <div style={{ display: 'flex' }}>
              <label style={{ width: '50%' }}>
                {this.showLabel ? <lenged>MM / YY</lenged> : null}
                <div id="card-expiry" />
              </label>
              <label style={{ width: '50%' }}>
                {this.showLabel ? <lenged>CVC</lenged> : null}
                <div id="card-cvc" />
              </label>
            </div>
            <div id="card-errors" class="element-errors"></div>
          </fieldset>
        </div>
        <button type="submit">Save</button>
      </form>
    );
  }
}

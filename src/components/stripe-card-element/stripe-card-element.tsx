import { Component, Prop, h, State, Method, Element, Host } from '@stencil/core';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';
import { checkPlatform } from '../../utils/utils';

export type FormSubmitHandler = (event: Event, component: MyComponent) => Promise<void>;
export type StripeDidLoadedHandler = (stripe: Stripe) => Promise<void>;

@Component({
  tag: 'stripe-card-element',
  styleUrl: 'stripe-card-element.scss',
  shadow: false,
})
export class MyComponent {
  @Element() el: HTMLElement;
  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  @State() loadStripeStatus: '' | 'loading' | 'success' | 'failure' = '';

  @State() stripe: Stripe;

  @Prop({
    mutable: true,
  })
  handleSubmit?: FormSubmitHandler;

  @Prop({
    mutable: true,
  })
  stripeDidLoaded?: StripeDidLoadedHandler;

  private cardNumber!: StripeCardNumberElement;
  private cardExpiry!: StripeCardExpiryElement;
  private cardCVC!: StripeCardCvcElement;

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey);
    }
  }

  /**
   * Set form submit event function
   * @param handler FormSubmitHandler
   */
  @Method()
  public async setFormSubmitHandler(handler: FormSubmitHandler): Promise<this> {
    this.handleSubmit = handler;
    return this;
  }

  @Method()
  public async setStripeDidLoadedHandler(handler: StripeDidLoadedHandler): Promise<this> {
    this.stripeDidLoaded = handler;
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
        if (!this.stripe) return;
        return this.initElement();
      })
      .then(() => {
        if (!this.stripe) return;
        if (!this.stripeDidLoaded) return;
        return this.stripeDidLoaded(this.stripe);
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

    this.cardNumber = elements.create('cardNumber');
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
  }

  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }

  render() {
    if (this.loadStripeStatus === 'failure') {
      return <p>Failed to load Stripe</p>;
    }
    return (
      <Host>
        <div class="stripe-payment-wrap">
          <form
            onSubmit={e => {
              if (!this.handleSubmit) return;
              this.handleSubmit(e, this);
            }}
          >
            <div class="stripe-heading">Add your payment information</div>
            <div>
              <h2 class="stripe-section-title">Card information</h2>
            </div>
            <div class="payment-info card visible">
              <fieldset>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" class="field" placeholder="jenny@example.com" required />
                </label>
              </fieldset>
              <fieldset>
                <div>
                  <label>
                    <lenged>Card Number</lenged>
                    <div id="card-number" />
                  </label>
                </div>
                <div style={{ display: 'flex' }}>
                  <label style={{ width: '50%' }}>
                    <lenged>MM / YY</lenged>
                    <div id="card-expiry" />
                  </label>
                  <label style={{ width: '50%' }}>
                    <lenged>CVC</lenged>
                    <div id="card-cvc" />
                  </label>
                </div>
                <div id="card-errors" class="element-errors"></div>
              </fieldset>
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </Host>
    );
  }
}

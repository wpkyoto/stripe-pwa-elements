import { Component, Prop, h, State, Method, Element } from '@stencil/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const style = {
  base: {
    iconColor: '#666ee8',
    color: '#31325f',
    fontWeight: 400,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '15px',
    '::placeholder': {
      color: '#aab7c4',
    },
    ':-webkit-autofill': {
      color: '#666ee8',
    },
  },
};

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {

  @Element() el: HTMLElement;
  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  @State() loadStripeStatus: '' | 'loading' | 'success' | 'failure' =  ''

  @State() stripe: Stripe

  cardElement!: HTMLDivElement
  cardErrorElement!: HTMLDivElement


  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey)
    }
  }

  @Method()
  public async initStripe(publishableKey: string) {
    this.loadStripeStatus = 'loading'
    loadStripe(publishableKey)
      .then(stripe => {
        this.loadStripeStatus = 'success'
        this.stripe = stripe
        return
      }).catch(e => {
        console.log(e)
        this.loadStripeStatus = 'failure'
        return
      })
      .then(() => {
        if (!this.stripe) return
        return this.initElement()
      })
  }

  private async initElement() {
    const elements = this.stripe.elements()
    const card = elements.create('card', {
      style,
      hidePostalCode: false
    });
    const cardElement = this.el.shadowRoot.getElementById('card-element')
    const cardErrorElement = this.el.shadowRoot.getElementById('card-errors')

    card.on('change', ({error}) => {
      if (error) {
        cardErrorElement.textContent = error.message;
        cardErrorElement.classList.add('visible');
      } else {
        cardErrorElement.classList.remove('visible');
      }
    });
    card.mount(cardElement);
  }

  render() {
    if (this.loadStripeStatus === 'failure') {
      return <p>Failed to load Stripe</p>
    }
    return (
      <form onSubmit={e => e.preventDefault()}>
          <div class="payment-info card visible">
            <fieldset>
              <label>
                <span>Card</span>
                <div
                  id="card-element"
                  class="field"
                />
              </label>
            </fieldset>
          </div>
          <div id="card-errors" class="element-errors"></div>
      </form>
    );
  }
}

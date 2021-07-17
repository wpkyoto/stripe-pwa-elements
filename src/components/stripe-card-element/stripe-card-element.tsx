import { Component, Prop, h, State, Method, EventEmitter, Event, Element } from '@stencil/core';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';
import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { checkPlatform } from '../../utils/utils';
import { StripeDidLoadedHandler, StripeLoadedEvent, FormSubmitEvent, FormSubmitHandler } from '../../interfaces';

i18next.use(I18nextBrowserLanguageDetector).init({
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {},
    },
    ja: {
      translation: {
        'Pay': '支払う',
        'Failed to load Stripe': 'ライブラリの読み込みに失敗しました。',
        'Add your payment information': 'カード情報を登録します。',
        'Card information': 'カード情報',
        'Card Number': 'カード番号',
        'MM / YY': '月 / 年',
        'CVC': 'セキュリティコード(CVC)',
      },
    },
  },
});

@Component({
  tag: 'stripe-card-element',
  styleUrl: 'stripe-card-element.scss',
  shadow: false,
})
export class MyComponent {
  @Element() el: HTMLElement;
  @State() loadStripeStatus: '' | 'loading' | 'success' | 'failure' = '';

  @State() stripe: Stripe;

  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  /**
   * Show the form label
   */
  @Prop() showLabel: boolean = false;

  /**
   * The client secret from paymentIntent.create response
   */
  @Prop() paymentIntentClientSecret?: string;

  /**
   * The component will provide a function to call the `stripe.confirmCardPayment`API.
   * If you want to customize the behavior, should set false.
   * And listen the 'formSubmit' event on the element
   */
  @Prop() shouldUseDefaultFormSubmitAction: boolean = true;

  /**
   * Form submit event handler
   */
  @Prop({
    mutable: true,
  })
  handleSubmit: FormSubmitHandler;

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
  stripeLoadedEventHandler() {
    if (this.stripeDidLoaded) {
      this.stripeDidLoaded(this.stripe);
    }
    this.stripeLoaded.emit({ stripe: this.stripe });
  }

  /**
   * Form submit event
   * @example
   * ```
   * stripeElement
   *   .addEventListener('formSubmit', async props => {
   *     const {
   *       detail: { stripe, cardNumber, event },
   *     } = props;
   *     const result = await stripe.createPaymentMethod({
   *       type: 'card',
   *       card: cardNumber,
   *     });
   *     console.log(result);
   *   })
   */
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

  /**
   * Default form submit action (just call a confirmCardPayment).
   * If you don't want use it, please set `should-use-default-form-submit-action="false"`
   * @param event
   * @param param1
   */
  private async defaultFormSubitAction(event: Event, { stripe, cardNumber, paymentIntentClientSecret }: FormSubmitEvent) {
    event.preventDefault();
    const result = await stripe.confirmCardPayment(paymentIntentClientSecret, {
      payment_method: {
        card: cardNumber,
      },
    });
    console.log(result);
  }

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey);
    } else {
      this.loadStripeStatus = 'failure';
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
      placeholder: i18next.t('Card Number'),
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
      const { cardCVC, cardExpiry, cardNumber, stripe, paymentIntentClientSecret } = this;
      const submitEventProps: FormSubmitEvent = { cardCVC, cardExpiry, cardNumber, stripe, paymentIntentClientSecret };
      if (this.handleSubmit) {
        this.handleSubmit(e, submitEventProps);
      } else if (this.shouldUseDefaultFormSubmitAction === true) {
        this.defaultFormSubitAction(e, submitEventProps);
      } else {
        e.preventDefault();
      }
      this.formSubmitEventHandler();
    });
  }
  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }

  render() {
    if (this.loadStripeStatus === 'failure') {
      return <p>{i18next.t('Failed to load Stripe')}</p>;
    }

    return (
      <div class="stripe-payment-wrap">
        <form id="stripe-card-element">
          <div class="stripe-heading">{i18next.t('Add your payment information')}</div>
          <div>
            <div class="stripe-section-title">{i18next.t('Card information')}</div>
          </div>
          <div class="payment-info card visible">
            <fieldset class="stripe-input-box">
              <div>
                <label>
                  {this.showLabel ? <lenged>{i18next.t('Card Number')}</lenged> : null}
                  <div id="card-number" />
                </label>
              </div>
              <div class="stripe-input-column" style={{ display: 'flex' }}>
                <label style={{ width: '50%' }}>
                  {this.showLabel ? <lenged>{i18next.t('MM / YY')}</lenged> : null}
                  <div id="card-expiry" />
                </label>
                <label style={{ width: '50%' }}>
                  {this.showLabel ? <lenged>{i18next.t('CVC')}</lenged> : null}
                  <div id="card-cvc" />
                </label>
              </div>
              <div id="card-errors" class="element-errors"></div>
            </fieldset>
          </div>
          <div style={{ marginTop: '32px' }}>
            <button type="submit">{i18next.t('Pay')}</button>
          </div>
        </form>
      </div>
    );
  }
}

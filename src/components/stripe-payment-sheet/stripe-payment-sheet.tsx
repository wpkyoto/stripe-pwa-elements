import { Component, Prop, h, State, Method, EventEmitter, Event, Element } from '@stencil/core';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';
import { checkPlatform } from '../../utils/utils';
import {
  StripeDidLoadedHandler,
  StripeLoadedEvent,
  FormSubmitEvent,
  FormSubmitHandler,
  ProgressStatus,
  PaymentRequestButtonOption,
  IntentType,
  DefaultFormSubmitResult,
} from '../../interfaces';
import { i18n } from '../../utils/i18n';

@Component({
  tag: 'stripe-payment',
  styleUrl: 'stripe-payment-sheet.scss',
  shadow: false,
})
export class StripePayment {
  @Element() el: HTMLStripePaymentElement;

  /**
   * Status of the Stripe client initilizing process
   */
  @State() loadStripeStatus: ProgressStatus = '';

  /**
   * Stripe client class
   */
  @State() stripe: Stripe;

  /**
   * Default submit handle type.
   * If you want to use `setupIntent`, should update this attribute.
   */
  @Prop() intentType: IntentType = 'payment';

  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *    tripeElement.initStripe('pk_test_XXXXXXXXX')
   *  })
   * ```
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
        this.errorMessage = e.message;
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
   * The progress status of the checkout process
   */
  @State() progress: ProgressStatus = '';

  /**
   * Update the form submit progress
   * @param progress
   * @returns
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *    // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.
   *    stripeElement.setAttribute('should-use-default-form-submit-action', false)
   *    stripeElement.addEventListener('formSubmit', async props => {
   *      const {
   *        detail: { stripe, cardNumber, event },
   *      } = props;
   *      const result = await stripe.createPaymentMethod({
   *        type: 'card',
   *        card: cardNumber,
   *      });
   *      console.log(result);
   *      stripeElement.updateProgress('success')
   *    });
   * })
   */
  @Method()
  public async updateProgress(progress: ProgressStatus) {
    this.progress = progress;
    return this;
  }

  /**
   * Error message
   */
  @State() errorMessage = '';

  /**
   * Set error message
   * @param errorMessage string
   * @returns
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *    // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.
   *    stripeElement.setAttribute('should-use-default-form-submit-action', false)
   *    stripeElement.addEventListener('formSubmit', async props => {
   *      try {
   *        throw new Error('debug')
   *      } catch (e) {
   *        stripeElement.setErrorMessage(`Error: ${e.message}`)
   *        stripeElement.updateProgress('failure')
   *      }
   *   });
   * })
   */
  @Method()
  public async setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    return this;
  }

  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  /**
   * Show the form label
   */
  @Prop() showLabel = false;

  /**
   * The client secret from paymentIntent.create response
   *
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *     stripeElement.setAttribute('intent-client-secret', 'dummy')
   *   })
   * ```
   *
   * @example
   * ```
   * <stripe-card-element intent-client-secret="dummy" />
   * ```
   */
  @Prop() intentClientSecret?: string;

  /**
   * The component will provide a function to call the `stripe.confirmCardPayment`API.
   * If you want to customize the behavior, should set false.
   * And listen the 'formSubmit' event on the element
   */
  @Prop() shouldUseDefaultFormSubmitAction = true;

  /**
   * If show PaymentRequest Button, should put true
   */
  @Prop()
  showPaymentRequestButton: boolean;

  @State() paymentRequestOption?: PaymentRequestButtonOption;
  /**
   * @param option
   * @private
   */
  @Method()
  public async setPaymentRequestOption(option: PaymentRequestButtonOption) {
    this.paymentRequestOption = option;
    this.createPaymentRequestButton();
    return this;
  }

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
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *     stripeElement
   *      .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {
   *       stripe
   *         .createSource({
   *           type: 'ideal',
   *           amount: 1099,
   *           currency: 'eur',
   *           owner: {
   *             name: 'Jenny Rosen',
   *           },
   *           redirect: {
   *             return_url: 'https://shop.example.com/crtA6B28E1',
   *           },
   *         })
   *         .then(function(result) {
   *           // Handle result.error or result.source
   *         });
   *       });
   *   })
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

  /**
   * Form submit event
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *     stripeElement
   *       .addEventListener('formSubmit', async props => {
   *         const {
   *           detail: { stripe, cardNumber, event },
   *         } = props;
   *         const result = await stripe.createPaymentMethod({
   *           type: 'card',
   *           card: cardNumber,
   *         });
   *         console.log(result);
   *       })
   *   })
   */
  @Event() formSubmit: EventEmitter<FormSubmitEvent>;
  private async formSubmitEventHandler() {
    const { cardCVC, cardExpiry, cardNumber, stripe } = this;

    this.formSubmit.emit({
      cardCVCElement: cardCVC,
      cardExpiryElement: cardExpiry,
      cardNumberElement: cardNumber,
      stripe,
    });
  }

  /**
   * Recieve the result of defaultFormSubmit event
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-card-element');
   * customElements
   *  .whenDefined('stripe-card-element')
   *  .then(() => {
   *     stripeElement.addEventListener('defaultFormSubmitResult', async ({detail}) => {
   *       if (detail instanceof Error) {
   *         console.error(detail)
   *       } else {
   *         console.log(detail)
   *       }
   *     })
   *   })
   */
  @Event() defaultFormSubmitResult: EventEmitter<DefaultFormSubmitResult>;
  private async defaultFormSubmitResultHandler(result: DefaultFormSubmitResult) {
    this.defaultFormSubmitResult.emit(result);
  }

  private cardNumber!: StripeCardNumberElement;
  private cardExpiry!: StripeCardExpiryElement;
  private cardCVC!: StripeCardCvcElement;

  componentWillUpdate() {
    if (!this.publishableKey) {
      return;
    }

    if (['success', 'loading'].includes(this.loadStripeStatus)) {
      return;
    }

    this.initStripe(this.publishableKey);
    this.createPaymentRequestButton();
  }

  /**
   * Default form submit action (just call a confirmCardPayment).
   * If you don't want use it, please set `should-use-default-form-submit-action="false"`
   * @param event
   * @param param1
   */
  private async defaultFormSubmitAction(event: Event, { stripe, cardNumberElement, intentClientSecret }: FormSubmitEvent) {
    event.preventDefault();
    try {
      const { intentType } = this;
      const result = await (() => {
        if (intentType === 'payment') {
          return stripe.confirmCardPayment(intentClientSecret, {
            payment_method: {
              card: cardNumberElement,
            },
          });
        }

        return stripe.confirmCardSetup(intentClientSecret, {
          payment_method: {
            card: cardNumberElement,
          },
        });
      })();

      this.defaultFormSubmitResultHandler(result);
    } catch (e) {
      this.defaultFormSubmitResultHandler(e);
      throw e;
    }
  }

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey);
    } else {
      this.loadStripeStatus = 'failure';
    }
  }

  /**
   * Initialize Component using Stripe Element
   */
  private async initElement() {
    const elements = this.stripe.elements();
    const handleCardError = ({ error }) => {
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = '';
      }
    };

    this.cardNumber = elements.create('cardNumber', {
      placeholder: i18n.t('Card Number'),
    });
    const cardNumberElement: HTMLElement = this.el.querySelector('#card-number');

    this.cardNumber.mount(cardNumberElement);
    this.cardNumber.on('change', handleCardError);

    this.cardExpiry = elements.create('cardExpiry');
    const cardExpiryElement: HTMLElement = this.el.querySelector('#card-expiry');

    this.cardExpiry.mount(cardExpiryElement);
    this.cardExpiry.on('change', handleCardError);

    this.cardCVC = elements.create('cardCvc');
    const cardCVCElement: HTMLElement = this.el.querySelector('#card-cvc');

    this.cardCVC.mount(cardCVCElement);
    this.cardCVC.on('change', handleCardError);

    document.getElementById('stripe-card-element').addEventListener('submit', async e => {
      const { cardCVC, cardExpiry, cardNumber, stripe, intentClientSecret } = this;
      const submitEventProps: FormSubmitEvent = {
        cardCVCElement: cardCVC,
        cardExpiryElement: cardExpiry,
        cardNumberElement: cardNumber,
        stripe,
        intentClientSecret,
      };

      this.progress = 'loading';
      try {
        if (this.handleSubmit) {
          await this.handleSubmit(e, submitEventProps);
        } else if (this.shouldUseDefaultFormSubmitAction === true && intentClientSecret) {
          await this.defaultFormSubmitAction(e, submitEventProps);
        } else {
          e.preventDefault();
        }

        await this.formSubmitEventHandler();
        if (this.handleSubmit || this.shouldUseDefaultFormSubmitAction === true) {
          this.progress = 'success';
        }
      } catch (e) {
        this.errorMessage = e.message;
        this.progress = 'failure';
      }
    });
  }
  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }

  disconnectedCallback() {
    if (this.cardNumber) {
      this.cardNumber.unmount();
    }

    if (this.cardExpiry) {
      this.cardExpiry.unmount();
    }

    if (this.cardCVC) {
      this.cardCVC.unmount();
    }
  }

  /**
   * Create payment request button
   * It's just proxy of stripe-payment-request-button
   */
  private createPaymentRequestButton() {
    const { showPaymentRequestButton, paymentRequestOption } = this;

    if (!showPaymentRequestButton || !paymentRequestOption) {
      return null;
    }

    if (!document) {
      return null;
    }

    const targetElement = document.getElementById('stripe-payment-request-button');
    const stripePaymentRequestElement = document.createElement('stripe-payment-request-button');

    targetElement.appendChild(stripePaymentRequestElement);

    const { paymentRequestPaymentMethodHandler, paymentRequestShippingOptionChangeHandler, paymentRequestShippingAddressChangeHandler } = paymentRequestOption;

    customElements.whenDefined('stripe-payment-request-button').then(() => {
      stripePaymentRequestElement.setPaymentRequestOption(paymentRequestOption);

      if (paymentRequestPaymentMethodHandler) {
        stripePaymentRequestElement.setPaymentMethodEventHandler(paymentRequestPaymentMethodHandler);
      }

      if (paymentRequestShippingOptionChangeHandler) {
        stripePaymentRequestElement.setPaymentRequestShippingOptionEventHandler(paymentRequestShippingOptionChangeHandler);
      }

      if (paymentRequestShippingAddressChangeHandler) {
        stripePaymentRequestElement.setPaymentRequestShippingAddressEventHandler(paymentRequestShippingAddressChangeHandler);
      }

      return stripePaymentRequestElement.initStripe(this.publishableKey);
    });
  }

  render() {
    const { errorMessage } = this;

    if (this.loadStripeStatus === 'failure') {
      return <p>{i18n.t('Failed to load Stripe')}</p>;
    }

    const disabled = this.progress === 'loading';

    return (
      <div class="stripe-payment-sheet-wrap">
        <form id="stripe-card-element">
          <div class="stripe-heading">{i18n.t('Add your payment information')}</div>
          <div id="stripe-payment-request-button" />
          <div>
            <div class="stripe-section-title">{i18n.t('Card information')}</div>
          </div>
          <div class="payment-info card visible">
            <fieldset class="stripe-input-box">
              <div>
                <label>
                  {this.showLabel ? <lenged>{i18n.t('Card Number')}</lenged> : null}
                  <div id="card-number" />
                </label>
              </div>
              <div class="stripe-input-column" style={{ display: 'flex' }}>
                <label style={{ width: '50%' }}>
                  {this.showLabel ? <lenged>{i18n.t('MM / YY')}</lenged> : null}
                  <div id="card-expiry" />
                </label>
                <label style={{ width: '50%' }}>
                  {this.showLabel ? <lenged>{i18n.t('CVC')}</lenged> : null}
                  <div id="card-cvc" />
                </label>
              </div>
              <div id="card-errors" class="element-errors">
                {errorMessage}
              </div>
            </fieldset>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div class="stripe-section-title">{i18n.t('Country or region')}</div>
          </div>
          <div class="payment-info card visible">
            <fieldset class="stripe-input-box">
              <div>
                <label>
                  {this.showLabel ? <lenged>{i18n.t('Postal Code')}</lenged> : null}
                  <input id="zip" name="zip" type="text" inputmode="numeric" class="stripe-input-box StripeElement" style={{ width: '100%' }} placeholder={i18n.t('Postal Code')} />
                </label>
              </div>
            </fieldset>
          </div>
          <div style={{ marginTop: '32px' }}>
            <button type="submit" disabled={disabled}>
              {this.progress === 'loading' ? i18n.t('Loading') : i18n.t('Pay')}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

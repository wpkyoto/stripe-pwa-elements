import { Component, Prop, h, State, Method, EventEmitter, Event, Element, Watch } from '@stencil/core';
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
  InitStripeOptions,
} from '../../interfaces';
import { i18n } from '../../utils/i18n';
import { stripeStore, getAndLoadCardElement } from './store';
import { StripeAPIError } from '../../utils/error';

@Component({
  tag: 'stripe-card-element',
  styleUrl: 'stripe-card-element.scss',
  shadow: false,
})
export class StripeCardElement {
  @Element() el: HTMLStripeCardElementElement;

  /**
   * Cleanup functions for memory management
   */
  private unsubscribeLoadStatus?: () => void;
  private formSubmitHandler?: (e: Event) => Promise<void>;
  private dynamicPaymentRequestButton?: HTMLStripePaymentRequestButtonElement;

  /**
   * Default submit handle type.
   * If you want to use `setupIntent`, should update this attribute.
   */
  @Prop() intentType: IntentType = 'payment';

  /**
   * If true, show zip code field
   */
  @Prop() zip = true;
  /**
   * Payment sheet title
   * By default we recommended to use these string
   * - 'Add your payment information' -> PaymentSheet / PaymentFlow(Android)
   * - 'Add a card' -> PaymentFlow(iOS)
   * These strings will translated automatically by this library.
   */
  @Prop() sheetTitle = 'Add your payment information';

  /**
   * Submit button label
   * By default we recommended to use these string
   * - 'Pay' -> PaymentSheet
   * - 'Add' -> PaymentFlow(Android)
   * - 'Add card' -> PaymentFlow(iOS)
   * - 'Add a card' -> PaymentFlow(iOS)
   * These strings will translated automatically by this library.
   *
   */
  @Prop() buttonLabel = 'Pay';

  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   * @param options
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
  public async initStripe(publishableKey: string, options?: InitStripeOptions) {
    const stripeAccount = options?.stripeAccount;

    stripeStore.set('el', this.el);
    stripeStore.set('stripeAccount', stripeAccount);
    stripeStore.set('applicationName', this.applicationName);
    stripeStore.set('publishableKey', publishableKey);

    // Unsubscribe from previous listener if it exists
    if (this.unsubscribeLoadStatus) {
      this.unsubscribeLoadStatus();
    }

    // Store the unsubscribe function for cleanup
    this.unsubscribeLoadStatus = stripeStore.onChange('loadStripeStatus', async newState => {
      if (newState !== 'success') {
        return;
      }

      await this.initElement();
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
   * zip code
   */
  @State() zipCode = '';

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
    stripeStore.set('errorMessage', errorMessage);
    return this;
  }

  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;
  @Watch('publishableKey')
  updatePublishableKey(publishableKey: string) {
    const options: InitStripeOptions = {};

    options.stripeAccount = stripeStore.get('stripeAccount');
    const hasOptionValue = Object.values(options).filter(Boolean).length > 0;

    this.initStripe(publishableKey, hasOptionValue ? options : undefined);
  }

  /**
   * Optional. Making API calls for connected accounts
   * @info https://stripe.com/docs/connect/authentication
   */
  @Prop() stripeAccount: string;
  @Watch('stripeAccount')
  updateStripeAccountId(stripeAccount: string) {
    this.initStripe(stripeStore.get('publishableKey'), {
      stripeAccount: stripeAccount,
    });
  }

  /**
   * Overwrite the application name that registered
   * For wrapper library (like Capacitor)
   */
  @Prop() applicationName = 'stripe-pwa-elements';

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
      stripe: stripeStore.get('stripe'),
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
    const { cardCVC, cardExpiry, cardNumber } = getAndLoadCardElement();
    const stripe = stripeStore.get('stripe');

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

  componentWillUpdate() {
    if (!stripeStore.get('publishableKey')) {
      return;
    }

    if (['success', 'loading'].includes(stripeStore.get('loadStripeStatus'))) {
      return;
    }

    this.initStripe(stripeStore.get('publishableKey'), {
      stripeAccount: stripeStore.get('stripeAccount'),
    });
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

      if (result.error) {
        throw new StripeAPIError(result.error);
      }

      this.defaultFormSubmitResultHandler(result);
    } catch (e) {
      console.error(e)
      this.defaultFormSubmitResultHandler(e);
      throw e;
    }
  }

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey, {
        stripeAccount: this.stripeAccount,
      });
    } else {
      stripeStore.set('loadStripeStatus', 'failure');
    }
  }

  /**
   * Initialize Component using Stripe Element
   */
  private async initElement() {
    const formElement = document.getElementById('stripe-card-element');

    // Remove previous listener if it exists to prevent memory leaks
    if (formElement && this.formSubmitHandler) {
      formElement.removeEventListener('submit', this.formSubmitHandler);
    }

    // Create and store the handler for cleanup
    this.formSubmitHandler = async (e: Event) => {
      const elements = getAndLoadCardElement();
      const { cardCVC, cardExpiry, cardNumber } = elements;
      const stripe = stripeStore.get('stripe');
      const { intentClientSecret } = this;

      const submitEventProps: FormSubmitEvent = {
        cardCVCElement: cardCVC,
        cardExpiryElement: cardExpiry,
        cardNumberElement: cardNumber,
        stripe,
        intentClientSecret,
        zipCode: this.zipCode,
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
        stripeStore.set('errorMessage', e.message);
        this.progress = 'failure';
      }
    };

    formElement.addEventListener('submit', this.formSubmitHandler);
  }
  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }

  disconnectedCallback() {
    // Cleanup Stripe card elements
    getAndLoadCardElement().unmount();

    // Cleanup form submit event listener
    if (this.formSubmitHandler) {
      const formElement = document.getElementById('stripe-card-element');
      if (formElement) {
        formElement.removeEventListener('submit', this.formSubmitHandler);
      }
      this.formSubmitHandler = undefined;
    }

    // Cleanup store listener
    if (this.unsubscribeLoadStatus) {
      this.unsubscribeLoadStatus();
      this.unsubscribeLoadStatus = undefined;
    }

    // Cleanup dynamically created payment request button
    if (this.dynamicPaymentRequestButton && this.dynamicPaymentRequestButton.parentNode) {
      this.dynamicPaymentRequestButton.parentNode.removeChild(this.dynamicPaymentRequestButton);
      this.dynamicPaymentRequestButton = undefined;
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

    // Cleanup existing button if it exists
    if (this.dynamicPaymentRequestButton && this.dynamicPaymentRequestButton.parentNode) {
      this.dynamicPaymentRequestButton.parentNode.removeChild(this.dynamicPaymentRequestButton);
    }

    const stripePaymentRequestElement = document.createElement('stripe-payment-request-button') as HTMLStripePaymentRequestButtonElement;

    // Store reference for cleanup
    this.dynamicPaymentRequestButton = stripePaymentRequestElement;

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
    const errorMessage = stripeStore.get('errorMessage');

    if (stripeStore.get('loadStripeStatus') === 'failure') {
      return <p>{i18n.t('Failed to load Stripe')}</p>;
    }

    const disabled = this.progress === 'loading';

    return (
      <div class="stripe-payment-sheet-wrap">
        <form id="stripe-card-element">
          <div class="stripe-heading">{i18n.t(this.sheetTitle)}</div>
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
            </fieldset>
          </div>
          <div id="card-errors" class="stripe-element-errors">
            {errorMessage}
          </div>
          {this.zip ? (
            <div style={{ marginTop: '1.5rem' }}>
              <div class="stripe-section-title">{i18n.t('Country or region')}</div>
            </div>
          ) : null}
          {this.zip ? (
            <div class="payment-info card visible">
              <fieldset class="stripe-input-box">
                <div>
                  <label>
                    {this.showLabel ? <lenged>{i18n.t('Postal Code')}</lenged> : null}
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      inputmode="numeric"
                      class="stripe-input-box StripeElement"
                      style={{ width: '100%' }}
                      placeholder={i18n.t('Postal Code')}
                      value={this.zipCode}
                      onInput={e => {
                        this.zipCode = (e.target as any).value;
                      }}
                    />
                  </label>
                </div>
              </fieldset>
            </div>
          ) : null}
          <div style={{ marginTop: '32px' }}>
            <button type="submit" disabled={disabled}>
              {this.progress === 'loading' ? i18n.t('Loading') : i18n.t(this.buttonLabel)}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

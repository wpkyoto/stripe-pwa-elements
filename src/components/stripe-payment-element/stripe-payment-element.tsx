import { Component, Prop, h, State, Method, EventEmitter, Event, Element, Watch } from '@stencil/core';
import { checkPlatform } from '../../utils/utils';
import {
  StripeDidLoadedHandler,
  StripeLoadedEvent,
  ProgressStatus,
  IntentType,
  DefaultFormSubmitResult,
  InitStripeOptions,
} from '../../interfaces';
import { i18n } from '../../utils/i18n';
import { serviceFactory } from '../../services/factory';
import type { IStripeService, IPaymentElementManager, CheckoutSessionOptions } from '../../services/interfaces';
import { StripeAPIError } from '../../utils/error';

import type { Stripe, StripeElements, StripeCheckout, StripeCheckoutConfirmResult } from '@stripe/stripe-js';

/**
 * Payment Element submit event
 */
export type PaymentElementSubmitEvent = {
  stripe: Stripe;
  elements?: StripeElements;
  intentClientSecret?: string;
  checkout?: StripeCheckout;
  checkoutSessionClientSecret?: string;
};

/**
 * Checkout Session submit event result
 */
export type CheckoutSessionFormSubmitResult = StripeCheckoutConfirmResult | Error;

/**
 * Payment Element submit handler
 */
export type PaymentElementSubmitHandler = (event: Event, props: PaymentElementSubmitEvent) => Promise<void>;

/**
 * Checkout Session initialization options
 */
export type InitCheckoutSessionOptions = InitStripeOptions & CheckoutSessionOptions;

@Component({
  tag: 'stripe-payment-element',
  styleUrl: 'stripe-payment-element.scss',
  shadow: false,
})
export class StripePaymentElement {
  @Element() el: HTMLStripePaymentElementElement;

  // Injected dependencies
  private stripeService: IStripeService;
  private paymentElementManager: IPaymentElementManager;

  // Form submit handler (bound to this instance)
  private _submitHandler: (e: Event) => Promise<void>;

  /**
   * Default submit handle type.
   * If you want to use `setupIntent`, should update this attribute.
   */
  @Prop() readonly intentType: IntentType = 'payment';

  /**
   * Payment sheet title
   * By default we recommended to use these string
   * - 'Add your payment information' -> PaymentSheet / PaymentFlow(Android)
   * - 'Add a card' -> PaymentFlow(iOS)
   * These strings will translated automatically by this library.
   */
  @Prop() readonly sheetTitle = 'Add your payment information';

  /**
   * Submit button label
   * By default we recommended to use these string
   * - 'Pay' -> PaymentSheet
   * - 'Add' -> PaymentFlow(Android)
   * - 'Add card' -> PaymentFlow(iOS)
   * - 'Add a card' -> PaymentFlow(iOS)
   * These strings will translated automatically by this library.
   */
  @Prop() readonly buttonLabel = 'Pay';

  /**
   * Get Stripe.js, and initialize elements
   * @param publishableKey
   * @param options
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *    stripeElement.initStripe('pk_test_XXXXXXXXX')
   *  })
   * ```
   */
  @Method()
  public async initStripe(publishableKey: string, options?: InitStripeOptions) {
    await this.stripeService.initialize(publishableKey, {
      stripeAccount: options?.stripeAccount,
      applicationName: this.applicationName,
    });

    // If already successfully loaded, initialize elements immediately
    if (this.stripeService.state.loadStripeStatus === 'success') {
      await this.initElement();
      this.stripeLoadedEventHandler();
    } else {
      // Otherwise, wait for successful load
      const unsubscribe = this.stripeService.onChange('loadStripeStatus', async newState => {
        if (newState !== 'success') {
          return;
        }

        await this.initElement();
        this.stripeLoadedEventHandler();
        unsubscribe(); // Clean up listener after first success
      });
    }
  }

  /**
   * Get Stripe.js and initialize with Checkout Session mode
   * Use this method when you have a Checkout Session client secret instead of Payment/Setup Intent
   * @param publishableKey - Your Stripe publishable API key
   * @param checkoutSessionClientSecret - The client secret from Checkout Session
   * @param options - Optional configuration
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *    stripeElement.initStripeWithCheckoutSession(
   *      'pk_test_XXXXXXXXX',
   *      'cs_xxx_secret_xxx'
   *    )
   *  })
   * ```
   */
  @Method()
  public async initStripeWithCheckoutSession(publishableKey: string, checkoutSessionClientSecret: string, options?: InitCheckoutSessionOptions) {
    await this.stripeService.initializeWithCheckoutSession(publishableKey, checkoutSessionClientSecret, {
      stripeAccount: options?.stripeAccount,
      applicationName: this.applicationName,
      elementsOptions: options?.elementsOptions,
    });

    // If already successfully loaded, initialize elements immediately
    if (this.stripeService.state.loadStripeStatus === 'success') {
      await this.initElement();
      this.stripeLoadedEventHandler();
    } else {
      // Otherwise, wait for successful load
      const unsubscribe = this.stripeService.onChange('loadStripeStatus', async newState => {
        if (newState !== 'success') {
          return;
        }

        await this.initElement();
        this.stripeLoadedEventHandler();
        unsubscribe(); // Clean up listener after first success
      });
    }
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
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *    stripeElement.updateProgress('success')
   *  })
   * ```
   */
  @Method()
  public async updateProgress(progress: ProgressStatus) {
    this.progress = progress;
    return this;
  }

  /**
   * Set error message
   * @param errorMessage string
   * @returns
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *    stripeElement.setErrorMessage('Payment failed')
   *  })
   * ```
   */
  @Method()
  public async setErrorMessage(errorMessage: string) {
    this.paymentElementManager.setError(errorMessage);
    return this;
  }

  /**
   * Your Stripe publishable API key.
   */
  @Prop() readonly publishableKey: string;

  @Watch('publishableKey')
  updatePublishableKey(publishableKey: string) {
    const options: InitStripeOptions = {};

    options.stripeAccount = this.stripeService.state.stripeAccount;
    const hasOptionValue = Object.values(options).filter(Boolean).length > 0;

    this.initStripe(publishableKey, hasOptionValue ? options : undefined);
  }

  /**
   * Optional. Making API calls for connected accounts
   * @info https://stripe.com/docs/connect/authentication
   */
  @Prop() readonly stripeAccount: string;

  @Watch('stripeAccount')
  updateStripeAccountId(stripeAccount: string) {
    this.initStripe(this.stripeService.state.publishableKey, {
      stripeAccount: stripeAccount,
    });
  }

  /**
   * Overwrite the application name that registered
   * For wrapper library (like Capacitor)
   */
  @Prop() readonly applicationName = 'stripe-pwa-elements';

  /**
   * The client secret from paymentIntent.create or setupIntent.create response
   * Use this for Payment Intent / Setup Intent mode
   *
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *     stripeElement.setAttribute('intent-client-secret', 'pi_xxx_secret_xxx')
   *   })
   * ```
   *
   * @example
   * ```
   * <stripe-payment-element intent-client-secret="pi_xxx_secret_xxx" />
   * ```
   */
  @Prop() readonly intentClientSecret?: string;

  @Watch('intentClientSecret')
  async updateIntentClientSecret() {
    // Re-initialize the payment element when client secret changes
    if (this.stripeService.state.loadStripeStatus === 'success') {
      await this.initElement();
    }
  }

  /**
   * The client secret from checkout session response
   * Use this for Checkout Session mode instead of intentClientSecret
   * When this prop is set, the component will use Checkout Session API
   *
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *     stripeElement.initStripeWithCheckoutSession('pk_test_xxx', 'cs_xxx_secret_xxx')
   *   })
   * ```
   */
  @Prop() readonly checkoutSessionClientSecret?: string;

  @Watch('checkoutSessionClientSecret')
  async updateCheckoutSessionClientSecret(newValue: string) {
    // Re-initialize with checkout session when client secret changes
    if (this.publishableKey && newValue) {
      await this.initStripeWithCheckoutSession(this.publishableKey, newValue, {
        stripeAccount: this.stripeAccount,
      });
    }
  }

  /**
   * The component will provide a function to call the `stripe.confirmPayment` API.
   * If you want to customize the behavior, should set false.
   * And listen the 'formSubmit' event on the element
   */
  @Prop() readonly shouldUseDefaultFormSubmitAction = true;

  /**
   * Form submit event handler
   */
  @Prop({
    mutable: true,
  })
  handleSubmit: PaymentElementSubmitHandler;

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
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *     stripeElement
   *      .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {
   *        console.log('Stripe loaded:', stripe);
   *       });
   *   })
   * ```
   */
  @Event() stripeLoaded: EventEmitter<StripeLoadedEvent>;

  private stripeLoadedEventHandler() {
    const event: StripeLoadedEvent = {
      stripe: this.stripeService.getStripe(),
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
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *     stripeElement
   *       .addEventListener('formSubmit', async props => {
   *         const { detail: { stripe, elements } } = props;
   *         console.log('Form submitted', stripe, elements);
   *       })
   *   })
   * ```
   */
  @Event() formSubmit: EventEmitter<PaymentElementSubmitEvent>;

  private async formSubmitEventHandler() {
    const elements = this.stripeService.getElements();
    const stripe = this.stripeService.getStripe();

    if (!elements || !stripe) {
      console.error('Stripe not properly initialized');
      return;
    }

    this.formSubmit.emit({
      stripe,
      elements,
      intentClientSecret: this.intentClientSecret,
    });
  }

  /**
   * Receive the result of defaultFormSubmit event
   * This event is emitted when using Payment Intent / Setup Intent mode
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *     stripeElement.addEventListener('defaultFormSubmitResult', async ({detail}) => {
   *       if (detail instanceof Error) {
   *         console.error(detail)
   *       } else {
   *         console.log(detail)
   *       }
   *     })
   *   })
   * ```
   */
  @Event() defaultFormSubmitResult: EventEmitter<DefaultFormSubmitResult>;

  private async defaultFormSubmitResultHandler(result: DefaultFormSubmitResult) {
    this.defaultFormSubmitResult.emit(result);
  }

  /**
   * Receive the result of checkout session confirm
   * This event is emitted when using Checkout Session mode
   * @example
   * ```
   * const stripeElement = document.createElement('stripe-payment-element');
   * customElements
   *  .whenDefined('stripe-payment-element')
   *  .then(() => {
   *     stripeElement.addEventListener('checkoutSessionConfirmResult', async ({detail}) => {
   *       if (detail instanceof Error) {
   *         console.error(detail)
   *       } else if (detail.type === 'success') {
   *         console.log('Payment successful:', detail.session)
   *       } else {
   *         console.error('Payment failed:', detail.error)
   *       }
   *     })
   *   })
   * ```
   */
  @Event() checkoutSessionConfirmResult: EventEmitter<CheckoutSessionFormSubmitResult>;

  private async checkoutSessionConfirmResultHandler(result: CheckoutSessionFormSubmitResult) {
    this.checkoutSessionConfirmResult.emit(result);
  }

  componentWillRender() {
    if (!this.stripeService.state.publishableKey) {
      return;
    }

    if (['success', 'loading'].includes(this.stripeService.state.loadStripeStatus)) {
      return;
    }

    this.initStripe(this.stripeService.state.publishableKey, {
      stripeAccount: this.stripeService.state.stripeAccount,
    });
  }

  /**
   * Default form submit action for Payment Intent / Setup Intent mode
   * Calls confirmPayment or confirmSetup based on intentType
   * If you don't want use it, please set `should-use-default-form-submit-action="false"`
   * @param event
   * @param param1
   */
  private async defaultFormSubmitAction(event: Event, { stripe, elements }: PaymentElementSubmitEvent) {
    event.preventDefault();
    try {
      const { intentType } = this;

      // Get current page URL for return_url
      const returnUrl = window.location.href;

      const result = await (() => {
        if (intentType === 'payment') {
          return stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: returnUrl,
            },
            redirect: 'if_required',
          });
        }

        return stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: returnUrl,
          },
          redirect: 'if_required',
        });
      })();

      if (result.error) {
        throw new StripeAPIError(result.error);
      }

      this.defaultFormSubmitResultHandler(result);
    } catch (e) {
      console.error(e);
      this.defaultFormSubmitResultHandler(e);
      throw e;
    }
  }

  /**
   * Checkout Session form submit action
   * Uses checkout.loadActions().confirm() to confirm the payment
   * @param event
   * @param checkout - The Stripe Checkout instance
   */
  private async checkoutSessionFormSubmitAction(event: Event, checkout: StripeCheckout) {
    event.preventDefault();
    try {
      // Load actions from the checkout session
      const loadActionsResult = await checkout.loadActions();

      if (loadActionsResult.type === 'error') {
        throw new Error(loadActionsResult.error.message);
      }

      const { actions } = loadActionsResult;

      // Get current page URL for return_url
      const returnUrl = window.location.href;

      // Confirm the payment using checkout session actions
      const result = await actions.confirm({
        returnUrl,
        redirect: 'if_required',
      });

      if (result.type === 'error') {
        throw new Error(result.error.message);
      }

      this.checkoutSessionConfirmResultHandler(result);
    } catch (e) {
      console.error(e);
      this.checkoutSessionConfirmResultHandler(e instanceof Error ? e : new Error(String(e)));
      throw e;
    }
  }

  constructor() {
    // Dependency Injection via factory
    this.stripeService = serviceFactory.createStripeService();
    this.paymentElementManager = serviceFactory.createPaymentElementManager(this.stripeService);

    if (this.publishableKey) {
      this.initStripe(this.publishableKey, {
        stripeAccount: this.stripeAccount,
      });
    }
  }

  /**
   * Initialize Component using Stripe Element
   */
  private async initElement() {
    // Initialize payment element
    await this.paymentElementManager.initialize(this.el);

    // Add form submit listener scoped to this component instance
    const formElement = this.el.querySelector('#stripe-payment-element');

    if (!formElement) {
      console.error('Form element #stripe-payment-element not found');
      return;
    }

    // Remove existing listener if present to prevent duplicates
    if (this._submitHandler) {
      formElement.removeEventListener('submit', this._submitHandler);
    }

    // Create and store the submit handler
    this._submitHandler = async (e: Event) => {
      const stripe = this.stripeService.getStripe();
      const isCheckoutSession = this.stripeService.state.isCheckoutSession;

      if (!stripe) {
        console.error('Stripe not properly initialized');
        return;
      }

      // Build submit event props based on mode
      const submitEventProps: PaymentElementSubmitEvent = {
        stripe,
      };

      if (isCheckoutSession) {
        // Checkout Session mode
        const checkout = this.stripeService.getCheckout();

        if (!checkout) {
          console.error('Checkout not properly initialized');
          return;
        }

        submitEventProps.checkout = checkout;
        submitEventProps.checkoutSessionClientSecret = this.checkoutSessionClientSecret;
      } else {
        // Payment Intent / Setup Intent mode
        const elements = this.stripeService.getElements();

        if (!elements) {
          console.error('Elements not properly initialized');
          return;
        }

        submitEventProps.elements = elements;
        submitEventProps.intentClientSecret = this.intentClientSecret;
      }

      this.progress = 'loading';
      try {
        if (this.handleSubmit) {
          await this.handleSubmit(e, submitEventProps);
        } else if (this.shouldUseDefaultFormSubmitAction === true) {
          if (isCheckoutSession && submitEventProps.checkout) {
            // Use Checkout Session confirmation
            await this.checkoutSessionFormSubmitAction(e, submitEventProps.checkout);
          } else if (this.intentClientSecret) {
            // Use Payment Intent / Setup Intent confirmation
            await this.defaultFormSubmitAction(e, submitEventProps);
          } else {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }

        await this.formSubmitEventHandler();
        if (this.handleSubmit || this.shouldUseDefaultFormSubmitAction === true) {
          this.progress = 'success';
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);

        this.paymentElementManager.setError(errorMessage);
        this.progress = 'failure';
      }
    };

    formElement.addEventListener('submit', this._submitHandler);
  }

  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }

  disconnectedCallback() {
    this.paymentElementManager.unmount();

    // Remove event listener to prevent memory leaks
    if (this._submitHandler) {
      const formElement = this.el.querySelector('#stripe-payment-element');

      if (formElement) {
        formElement.removeEventListener('submit', this._submitHandler);
      }
    }
  }

  render() {
    const { loadStripeStatus, isCheckoutSession } = this.stripeService.state;
    const { errorMessage } = this.paymentElementManager.getState();

    if (loadStripeStatus === 'failure') {
      return <p>{i18n.t('Failed to load Stripe')}</p>;
    }

    // Determine if button should be disabled
    // For Checkout Session mode: check if checkout is initialized (loadStripeStatus === 'success')
    // For Payment Intent mode: check if intentClientSecret is set
    const hasValidSecret = isCheckoutSession ? loadStripeStatus === 'success' : !!this.intentClientSecret;
    const disabled = this.progress === 'loading' || !hasValidSecret;

    return (
      <div class="stripe-payment-sheet-wrap">
        <form id="stripe-payment-element">
          <div class="stripe-heading">{i18n.t(this.sheetTitle)}</div>
          <div>
            <div class="stripe-section-title">{i18n.t('Payment information')}</div>
          </div>
          <div class="payment-info visible">
            <div id="payment-element" />
          </div>
          <div id="payment-errors" class="stripe-element-errors">
            {errorMessage}
          </div>
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

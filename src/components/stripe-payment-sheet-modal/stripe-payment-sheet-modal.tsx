import { Component, Prop, h, Method, Element, Event, EventEmitter } from '@stencil/core';
import { StripeDidLoadedHandler, FormSubmitHandler, ProgressStatus, PaymentRequestButtonOption, IntentType } from '../../interfaces';

@Component({
  tag: 'stripe-payment-sheet',
  styleUrl: 'stripe-payment-sheet-modal.css',
  shadow: false,
})
export class StripePaymentSheet {
  @Element() el: HTMLStripePaymentSheetElement;

  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  /**
   * Overwrite the application name that registered
   * For wrapper library (like Capacitor)
   */
  @Prop() applicationName: string;

  /**
   * Show the form label
   */
  @Prop() showLabel = false;

  /**
   * Payment sheet title
   * By default we recommended to use these string
   * - 'Add your payment information' -> PaymentSheet / PaymentFlow(Android)
   * - 'Add a card' -> PaymentFlow(iOS)
   * These strings will translated automatically by this library.
   */
  @Prop() sheetTitle: string;

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
  @Prop() buttonLabel: string;

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
   * Default submit handle type.
   * If you want to use `setupIntent`, should update this attribute.
   * @example
   * ```
   * <stripe-payment-sheet intent-type="setup" />
   * ```
   */
  @Prop() intentType: IntentType = 'payment';

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
   * If true, the modal display close button
   */
  @Prop() showCloseButton = true;

  /**
   * If true, show zip code field
   */
  @Prop() zip = true;

  /**
   * Modal state.
   * If true, the modal will open
   */
  @Prop() open = false;

  /**
   *
   */
  @Event() closed: EventEmitter;

  componentDidLoad() {
    const modal = this.el.querySelector('stripe-sheet');

    modal.addEventListener('close', () => {
      this.closed.emit();
    });
  }

  /**
   * Get the inner component
   */
  @Method()
  public async getStripePaymentSheetElement() {
    return this.el.querySelector('stripe-payment');
  }

  /**
   * open modal
   */
  @Method()
  public async present() {
    this.open = true;

    return new Promise((resolve, reject) => {
      const paymentSheet = this.el.querySelector('stripe-payment');

      paymentSheet.addEventListener('formSubmit', async props => {
        resolve(props);
      });
      this.el.addEventListener('closed', () => reject());
    });
  }

  /**
   * Update Stripe client loading process
   */
  @Method()
  public async updateProgress(progress: ProgressStatus) {
    const paymentSheet = this.el.querySelector('stripe-payment');

    return paymentSheet.updateProgress(progress);
  }

  /**
   * Remove the modal
   */
  @Method()
  public async destroy() {
    const paymentSheet = this.el.querySelector('stripe-payment');

    paymentSheet.remove();
    this.el.remove();
  }

  /**
   *
   * Add payment request button
   */
  @Method()
  public async setPaymentRequestButton(options: PaymentRequestButtonOption) {
    const elements = this.el.getElementsByTagName('stripe-payment');

    if (elements.length < 1) {
      return;
    }

    const paymentSheetElement = elements[0];

    if (!paymentSheetElement) {
      return;
    }

    paymentSheetElement.setAttribute('show-payment-request-button', 'true');
    if (this.applicationName) {
      paymentSheetElement.setAttribute('application-name', this.applicationName);
    }

    paymentSheetElement.setPaymentRequestOption(options);
  }

  render() {
    return (
      <stripe-sheet open={this.open} showCloseButton={this.showCloseButton}>
        <stripe-payment
          showLabel={this.showLabel}
          publishableKey={this.publishableKey}
          intentClientSecret={this.intentClientSecret}
          shouldUseDefaultFormSubmitAction={this.shouldUseDefaultFormSubmitAction}
          handleSubmit={this.handleSubmit}
          stripeDidLoaded={this.stripeDidLoaded}
          intentType={this.intentType}
          zip={this.zip}
          buttonLabel={this.buttonLabel}
          sheetTitle={this.sheetTitle}
          applicationName={this.applicationName}
        ></stripe-payment>
      </stripe-sheet>
    );
  }
}

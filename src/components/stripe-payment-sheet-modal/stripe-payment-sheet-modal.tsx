import { Component, Prop, h, Method, Element, Event, EventEmitter } from '@stencil/core';
import { StripeDidLoadedHandler, FormSubmitHandler, ProgressStatus } from '../../interfaces';

@Component({
  tag: 'stripe-payment-sheet-modal',
  styleUrl: 'stripe-payment-sheet-modal.css',
  shadow: false,
})
export class StripePaymentSheetModal {
  @Element() el: HTMLStripePaymentSheetModalElement;

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
   *     stripeElement.setAttribute('payment-intent-client-secret', 'dummy')
   *   })
   * ```
   *
   * @example
   * ```
   * <stripe-card-element payment-intent-client-secret="dummy" />
   * ```
   */
  @Prop() paymentIntentClientSecret?: string;

  /**
   * The component will provide a function to call the `stripe.confirmCardPayment`API.
   * If you want to customize the behavior, should set false.
   * And listen the 'formSubmit' event on the element
   */
  @Prop() shouldUseDefaultFormSubmitAction = true;

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
   * Modal state.
   * If true, the modal will open
   */
  @Prop() open = false;

  /**
   *
   */
  @Event() closed: EventEmitter;

  componentDidLoad() {
    const modal = this.el.querySelector('stripe-element-modal');

    modal.addEventListener('close', () => {
      this.closed.emit();
    });
  }

  @Method()
  public async getStripePaymentSheetElement() {
    return this.el.querySelector('stripe-payment-sheet');
  }

  @Method()
  public present() {
    this.open = true;

    return new Promise(async (resolve, reject) => {
      const paymentSheet = this.el.querySelector('stripe-payment-sheet');

      paymentSheet.addEventListener('formSubmit', async props => {
        resolve(props);
      });
      this.el.addEventListener('closed', () => reject());
    });
  }

  @Method()
  public async updateProgress(progress: ProgressStatus) {
    const paymentSheet = this.el.querySelector('stripe-payment-sheet');

    return paymentSheet.updateProgress(progress);
  }

  @Method()
  public async destroy() {
    const paymentSheet = this.el.querySelector('stripe-payment-sheet');

    paymentSheet.remove();
    this.el.remove();
  }

  render() {
    return (
      <stripe-element-modal open={this.open} showCloseButton={this.showCloseButton}>
        <stripe-payment-sheet
          showLabel={this.showLabel}
          publishableKey={this.publishableKey}
          paymentIntentClientSecret={this.paymentIntentClientSecret}
          shouldUseDefaultFormSubmitAction={this.shouldUseDefaultFormSubmitAction}
          handleSubmit={this.handleSubmit}
          stripeDidLoaded={this.stripeDidLoaded}
        ></stripe-payment-sheet>
      </stripe-element-modal>
    );
  }
}

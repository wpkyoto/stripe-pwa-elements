import { Component, Prop, h, Method } from '@stencil/core';
import { StripeDidLoadedHandler, FormSubmitHandler } from '../../interfaces';

@Component({
  tag: 'stripe-payment-sheet-modal',
  styleUrl: 'stripe-payment-sheet-modal.css',
  shadow: false,
})
export class StripePaymentSheetModal {
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

  @Method()
  public async getStripePaymentSheetElement() {
    const targets = document.getElementsByTagName('stripe-payment-sheet');
    return targets[0];
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

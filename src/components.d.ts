/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { DefaultFormSubmitResult, FormSubmitEvent, FormSubmitHandler, IntentType, PaymentRequestButtonOption, PaymentRequestPaymentMethodEventHandler, PaymentRequestShippingAddressEventHandler, PaymentRequestShippingOptionEventHandler, ProgressStatus, StripeDidLoadedHandler, StripeLoadedEvent } from "./interfaces";
import { PaymentRequestOptions } from "@stripe/stripe-js";
export namespace Components {
    interface StripePayment {
        /**
          * Form submit event handler
         */
        "handleSubmit": FormSubmitHandler;
        /**
          * Get Stripe.js, and initialize elements
          * @param publishableKey
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {    tripeElement.initStripe('pk_test_XXXXXXXXX')  }) ```
         */
        "initStripe": (publishableKey: string) => Promise<void>;
        /**
          * The client secret from paymentIntent.create response
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement.setAttribute('intent-client-secret', 'dummy')   }) ```
          * @example ``` <stripe-card-element intent-client-secret="dummy" /> ```
         */
        "intentClientSecret"?: string;
        /**
          * Default submit handle type. If you want to use `setupIntent`, should update this attribute.
         */
        "intentType": IntentType;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey": string;
        /**
          * Set error message
          * @param errorMessage string
          * @returns 
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {    // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.    stripeElement.setAttribute('should-use-default-form-submit-action', false)    stripeElement.addEventListener('formSubmit', async props => {      try {        throw new Error('debug')      } catch (e) {        stripeElement.setErrorMessage(`Error: ${e.message}`)        stripeElement.updateProgress('failure')      }   }); })
         */
        "setErrorMessage": (errorMessage: string) => Promise<this>;
        /**
          * @param option
          * @private
         */
        "setPaymentRequestOption": (option: PaymentRequestButtonOption) => Promise<this>;
        /**
          * The component will provide a function to call the `stripe.confirmCardPayment`API. If you want to customize the behavior, should set false. And listen the 'formSubmit' event on the element
         */
        "shouldUseDefaultFormSubmitAction": boolean;
        /**
          * Show the form label
         */
        "showLabel": boolean;
        /**
          * If show PaymentRequest Button, should put true
         */
        "showPaymentRequestButton": boolean;
        /**
          * Stripe.js class loaded handler
         */
        "stripeDidLoaded"?: StripeDidLoadedHandler;
        /**
          * Update the form submit progress
          * @param progress
          * @returns 
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {    // You must set the attributes to stop running default form submit action when you want to listen the 'formSubmit' event.    stripeElement.setAttribute('should-use-default-form-submit-action', false)    stripeElement.addEventListener('formSubmit', async props => {      const {        detail: { stripe, cardNumber, event },      } = props;      const result = await stripe.createPaymentMethod({        type: 'card',        card: cardNumber,      });      console.log(result);      stripeElement.updateProgress('success')    }); })
         */
        "updateProgress": (progress: ProgressStatus) => Promise<this>;
        /**
          * If true, show zip code field
         */
        "zip": boolean;
    }
    interface StripePaymentRequestButton {
        /**
          * Get Stripe.js, and initialize elements
          * @param publishableKey
         */
        "initStripe": (publishableKey: string) => Promise<void>;
        /**
          * Set handler of the `paymentRequest.on('paymentmethod'` event.
          * @example ```  element.setPaymentMethodEventHandler(async (event, stripe) => { // Confirm the PaymentIntent with the payment method returned from the payment request.   const {error} = await stripe.confirmCardPayment(     paymentIntent.client_secret,     {      payment_method: event.paymentMethod.id,      shipping: {        name: event.shippingAddress.recipient,        phone: event.shippingAddress.phone,        address: {          line1: event.shippingAddress.addressLine[0],          city: event.shippingAddress.city,          postal_code: event.shippingAddress.postalCode,          state: event.shippingAddress.region,          country: event.shippingAddress.country,        },      },    },    {handleActions: false}  ); ```
         */
        "paymentMethodEventHandler"?: PaymentRequestPaymentMethodEventHandler;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey": string;
        /**
          * Register event handler for `paymentRequest.on('paymentmethod'` event.
         */
        "setPaymentMethodEventHandler": (handler: PaymentRequestPaymentMethodEventHandler) => Promise<void>;
        /**
          * @param option
          * @private
         */
        "setPaymentRequestOption": (option: PaymentRequestOptions) => Promise<this>;
        /**
          * Register event handler for `paymentRequest.on('shippingaddresschange'` event.
         */
        "setPaymentRequestShippingAddressEventHandler": (handler: PaymentRequestShippingAddressEventHandler) => Promise<void>;
        /**
          * Register event handler for `paymentRequest.on('shippingoptionchange'` event.
         */
        "setPaymentRequestShippingOptionEventHandler": (handler: PaymentRequestShippingOptionEventHandler) => Promise<void>;
        /**
          * Set handler of the `paymentRequest.on('shippingaddresschange')` event
          * @example ```  element.setPaymentRequestShippingAddressEventHandler(async (event, stripe) => {   const response = await store.updatePaymentIntentWithShippingCost(     paymentIntent.id,     store.getLineItems(),     event.shippingOption   );  }) ```
         */
        "shippingAddressEventHandler"?: PaymentRequestShippingAddressEventHandler;
        /**
          * Set handler of the `paymentRequest.on('shippingoptionchange')` event
          * @example ```  element.setPaymentRequestShippingOptionEventHandler(async (event, stripe) => {   event.updateWith({status: 'success'});  }) ```
         */
        "shippingOptionEventHandler"?: PaymentRequestShippingOptionEventHandler;
        /**
          * Stripe.js class loaded handler
         */
        "stripeDidLoaded"?: StripeDidLoadedHandler;
    }
    interface StripePaymentSheet {
        /**
          * Remove the modal
         */
        "destroy": () => Promise<void>;
        /**
          * Get the inner component
         */
        "getStripePaymentSheetElement": () => Promise<HTMLStripePaymentElement>;
        /**
          * Form submit event handler
         */
        "handleSubmit": FormSubmitHandler;
        /**
          * The client secret from paymentIntent.create response
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement.setAttribute('intent-client-secret', 'dummy')   }) ```
          * @example ``` <stripe-card-element intent-client-secret="dummy" /> ```
         */
        "intentClientSecret"?: string;
        /**
          * Default submit handle type. If you want to use `setupIntent`, should update this attribute.
          * @example ``` <stripe-payment-sheet intent-type="setup" /> ```
         */
        "intentType": IntentType;
        /**
          * Modal state. If true, the modal will open
         */
        "open": boolean;
        /**
          * open modal
         */
        "present": () => Promise<unknown>;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey": string;
        /**
          * Add payment request button
         */
        "setPaymentRequestButton": (options: PaymentRequestButtonOption) => Promise<void>;
        /**
          * The component will provide a function to call the `stripe.confirmCardPayment`API. If you want to customize the behavior, should set false. And listen the 'formSubmit' event on the element
         */
        "shouldUseDefaultFormSubmitAction": boolean;
        /**
          * If true, the modal display close button
         */
        "showCloseButton": boolean;
        /**
          * Show the form label
         */
        "showLabel": boolean;
        /**
          * Stripe.js class loaded handler
         */
        "stripeDidLoaded"?: StripeDidLoadedHandler;
        /**
          * Update Stripe client loading process
         */
        "updateProgress": (progress: ProgressStatus) => Promise<HTMLStripePaymentElement>;
        /**
          * If true, show zip code field
         */
        "zip": boolean;
    }
    interface StripeSheet {
        /**
          * Close the modal
         */
        "closeModal": () => Promise<void>;
        /**
          * Modal state. If true, the modal will open
         */
        "open": boolean;
        /**
          * Open the modal
         */
        "openModal": () => Promise<void>;
        /**
          * If true, the modal display close button
         */
        "showCloseButton": boolean;
        /**
          * Toggle modal state
         */
        "toggleModal": () => Promise<void>;
    }
}
declare global {
    interface HTMLStripePaymentElement extends Components.StripePayment, HTMLStencilElement {
    }
    var HTMLStripePaymentElement: {
        prototype: HTMLStripePaymentElement;
        new (): HTMLStripePaymentElement;
    };
    interface HTMLStripePaymentRequestButtonElement extends Components.StripePaymentRequestButton, HTMLStencilElement {
    }
    var HTMLStripePaymentRequestButtonElement: {
        prototype: HTMLStripePaymentRequestButtonElement;
        new (): HTMLStripePaymentRequestButtonElement;
    };
    interface HTMLStripePaymentSheetElement extends Components.StripePaymentSheet, HTMLStencilElement {
    }
    var HTMLStripePaymentSheetElement: {
        prototype: HTMLStripePaymentSheetElement;
        new (): HTMLStripePaymentSheetElement;
    };
    interface HTMLStripeSheetElement extends Components.StripeSheet, HTMLStencilElement {
    }
    var HTMLStripeSheetElement: {
        prototype: HTMLStripeSheetElement;
        new (): HTMLStripeSheetElement;
    };
    interface HTMLElementTagNameMap {
        "stripe-payment": HTMLStripePaymentElement;
        "stripe-payment-request-button": HTMLStripePaymentRequestButtonElement;
        "stripe-payment-sheet": HTMLStripePaymentSheetElement;
        "stripe-sheet": HTMLStripeSheetElement;
    }
}
declare namespace LocalJSX {
    interface StripePayment {
        /**
          * Form submit event handler
         */
        "handleSubmit"?: FormSubmitHandler;
        /**
          * The client secret from paymentIntent.create response
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement.setAttribute('intent-client-secret', 'dummy')   }) ```
          * @example ``` <stripe-card-element intent-client-secret="dummy" /> ```
         */
        "intentClientSecret"?: string;
        /**
          * Default submit handle type. If you want to use `setupIntent`, should update this attribute.
         */
        "intentType"?: IntentType;
        /**
          * Recieve the result of defaultFormSubmit event
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement.addEventListener('defaultFormSubmitResult', async ({detail}) => {       if (detail instanceof Error) {         console.error(detail)       } else {         console.log(detail)       }     })   })
         */
        "onDefaultFormSubmitResult"?: (event: CustomEvent<DefaultFormSubmitResult>) => void;
        /**
          * Form submit event
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement       .addEventListener('formSubmit', async props => {         const {           detail: { stripe, cardNumber, event },         } = props;         const result = await stripe.createPaymentMethod({           type: 'card',           card: cardNumber,         });         console.log(result);       })   })
         */
        "onFormSubmit"?: (event: CustomEvent<FormSubmitEvent>) => void;
        /**
          * Stripe Client loaded event
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement      .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {       stripe         .createSource({           type: 'ideal',           amount: 1099,           currency: 'eur',           owner: {             name: 'Jenny Rosen',           },           redirect: {             return_url: 'https://shop.example.com/crtA6B28E1',           },         })         .then(function(result) {           // Handle result.error or result.source         });       });   }) ```
         */
        "onStripeLoaded"?: (event: CustomEvent<StripeLoadedEvent>) => void;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey"?: string;
        /**
          * The component will provide a function to call the `stripe.confirmCardPayment`API. If you want to customize the behavior, should set false. And listen the 'formSubmit' event on the element
         */
        "shouldUseDefaultFormSubmitAction"?: boolean;
        /**
          * Show the form label
         */
        "showLabel"?: boolean;
        /**
          * If show PaymentRequest Button, should put true
         */
        "showPaymentRequestButton"?: boolean;
        /**
          * Stripe.js class loaded handler
         */
        "stripeDidLoaded"?: StripeDidLoadedHandler;
        /**
          * If true, show zip code field
         */
        "zip"?: boolean;
    }
    interface StripePaymentRequestButton {
        /**
          * Stripe Client loaded event
          * @example ``` stripeElement  .addEventListener('stripeLoaded', async ({ detail: {stripe} }) => {   stripe     .createSource({       type: 'ideal',       amount: 1099,       currency: 'eur',       owner: {         name: 'Jenny Rosen',       },       redirect: {         return_url: 'https://shop.example.com/crtA6B28E1',       },     })     .then(function(result) {       // Handle result.error or result.source     });   }); ```
         */
        "onStripeLoaded"?: (event: CustomEvent<StripeLoadedEvent>) => void;
        /**
          * Set handler of the `paymentRequest.on('paymentmethod'` event.
          * @example ```  element.setPaymentMethodEventHandler(async (event, stripe) => { // Confirm the PaymentIntent with the payment method returned from the payment request.   const {error} = await stripe.confirmCardPayment(     paymentIntent.client_secret,     {      payment_method: event.paymentMethod.id,      shipping: {        name: event.shippingAddress.recipient,        phone: event.shippingAddress.phone,        address: {          line1: event.shippingAddress.addressLine[0],          city: event.shippingAddress.city,          postal_code: event.shippingAddress.postalCode,          state: event.shippingAddress.region,          country: event.shippingAddress.country,        },      },    },    {handleActions: false}  ); ```
         */
        "paymentMethodEventHandler"?: PaymentRequestPaymentMethodEventHandler;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey"?: string;
        /**
          * Set handler of the `paymentRequest.on('shippingaddresschange')` event
          * @example ```  element.setPaymentRequestShippingAddressEventHandler(async (event, stripe) => {   const response = await store.updatePaymentIntentWithShippingCost(     paymentIntent.id,     store.getLineItems(),     event.shippingOption   );  }) ```
         */
        "shippingAddressEventHandler"?: PaymentRequestShippingAddressEventHandler;
        /**
          * Set handler of the `paymentRequest.on('shippingoptionchange')` event
          * @example ```  element.setPaymentRequestShippingOptionEventHandler(async (event, stripe) => {   event.updateWith({status: 'success'});  }) ```
         */
        "shippingOptionEventHandler"?: PaymentRequestShippingOptionEventHandler;
        /**
          * Stripe.js class loaded handler
         */
        "stripeDidLoaded"?: StripeDidLoadedHandler;
    }
    interface StripePaymentSheet {
        /**
          * Form submit event handler
         */
        "handleSubmit"?: FormSubmitHandler;
        /**
          * The client secret from paymentIntent.create response
          * @example ``` const stripeElement = document.createElement('stripe-card-element'); customElements  .whenDefined('stripe-card-element')  .then(() => {     stripeElement.setAttribute('intent-client-secret', 'dummy')   }) ```
          * @example ``` <stripe-card-element intent-client-secret="dummy" /> ```
         */
        "intentClientSecret"?: string;
        /**
          * Default submit handle type. If you want to use `setupIntent`, should update this attribute.
          * @example ``` <stripe-payment-sheet intent-type="setup" /> ```
         */
        "intentType"?: IntentType;
        "onClosed"?: (event: CustomEvent<any>) => void;
        /**
          * Modal state. If true, the modal will open
         */
        "open"?: boolean;
        /**
          * Your Stripe publishable API key.
         */
        "publishableKey"?: string;
        /**
          * The component will provide a function to call the `stripe.confirmCardPayment`API. If you want to customize the behavior, should set false. And listen the 'formSubmit' event on the element
         */
        "shouldUseDefaultFormSubmitAction"?: boolean;
        /**
          * If true, the modal display close button
         */
        "showCloseButton"?: boolean;
        /**
          * Show the form label
         */
        "showLabel"?: boolean;
        /**
          * Stripe.js class loaded handler
         */
        "stripeDidLoaded"?: StripeDidLoadedHandler;
        /**
          * If true, show zip code field
         */
        "zip"?: boolean;
    }
    interface StripeSheet {
        "onClose"?: (event: CustomEvent<any>) => void;
        /**
          * Modal state. If true, the modal will open
         */
        "open"?: boolean;
        /**
          * If true, the modal display close button
         */
        "showCloseButton"?: boolean;
    }
    interface IntrinsicElements {
        "stripe-payment": StripePayment;
        "stripe-payment-request-button": StripePaymentRequestButton;
        "stripe-payment-sheet": StripePaymentSheet;
        "stripe-sheet": StripeSheet;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "stripe-payment": LocalJSX.StripePayment & JSXBase.HTMLAttributes<HTMLStripePaymentElement>;
            "stripe-payment-request-button": LocalJSX.StripePaymentRequestButton & JSXBase.HTMLAttributes<HTMLStripePaymentRequestButtonElement>;
            "stripe-payment-sheet": LocalJSX.StripePaymentSheet & JSXBase.HTMLAttributes<HTMLStripePaymentSheetElement>;
            "stripe-sheet": LocalJSX.StripeSheet & JSXBase.HTMLAttributes<HTMLStripeSheetElement>;
        }
    }
}

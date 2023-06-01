import { StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, StripeElements, } from "@stripe/stripe-js";
import { i18n } from "../../utils/i18n";
import { waitForElm } from "../../utils/utils";
import { stripeStore } from "./store";

export type PWAStripeCardElementProps = {
    el: HTMLStripePaymentElement
    elements: StripeElements
  }
export  class PWAStripeCardElement {
    private el: HTMLStripePaymentElement
    private elements: StripeElements
    private static _instance: PWAStripeCardElement;
    public cardNumber!: StripeCardNumberElement;
    public cardExpiry!: StripeCardExpiryElement;
    public cardCVC!: StripeCardCvcElement;
    public static getInstance(props: PWAStripeCardElementProps): PWAStripeCardElement {
      if (!this._instance) {
        this._instance = new PWAStripeCardElement(props)
      }
      return this._instance
    }
    private constructor(props: PWAStripeCardElementProps) {
      this.el = props.el
      this.elements = props.elements
      this.init()
    }
    /**
     * Init each Card Elements
     */
    private async init() {
      const { elements, el } = this 
      const handleCardError = ({error}) => {
        if (error) {
          stripeStore.set('errorMessage', error.message)
          return
        }
        stripeStore.set('errorMessage', '')
      }
      this.cardNumber = elements.create('cardNumber', {
        placeholder: i18n.t('Card Number'),
      });
  
      const cardNumberElement: HTMLElement = await waitForElm(el, '#card-number');
  
      this.cardNumber.mount(cardNumberElement);
      this.cardNumber.on('change', handleCardError);
  
      this.cardExpiry = elements.create('cardExpiry');
      const cardExpiryElement: HTMLElement = await waitForElm(el, '#card-expiry');
  
      this.cardExpiry.mount(cardExpiryElement);
      this.cardExpiry.on('change', handleCardError);
  
      this.cardCVC = elements.create('cardCvc');
      const cardCVCElement: HTMLElement = await waitForElm(el, '#card-cvc');
  
      this.cardCVC.mount(cardCVCElement);
      this.cardCVC.on('change', handleCardError);
    }

    public unmount() {
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
  }
  
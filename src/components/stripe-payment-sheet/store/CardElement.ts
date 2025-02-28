import { StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, StripeElements, } from "@stripe/stripe-js";
import { i18n } from "../../../utils/i18n";
import { waitForElm } from "../../../utils/utils";
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

    constructor(props: PWAStripeCardElementProps) {
      this.el = props.el
      this.elements = props.elements
      this.init()
    }

    public static getInstance(props: PWAStripeCardElementProps): PWAStripeCardElement {
      if (!this._instance) {
        this._instance = new PWAStripeCardElement(props)
      }
      return this._instance
    }

    /**
     * Re-create the instance when you replace the API key
     * @param props 
     * @returns 
     */
    public static recreateInstance(props: PWAStripeCardElementProps) {
      if (this._instance) this._instance.unmount()
      this._instance = new PWAStripeCardElement(props)
      return this._instance
    }

    /**
     * Init each Card Elements
     */
    private async init() {
      try {
        const { elements, el } = this 
        const handleCardError = ({error}) => {
          if (error) {
            stripeStore.set('errorMessage', error.message)
            return
          }
          stripeStore.set('errorMessage', '')
        }

        // 要素が存在することを確認
        const cardNumberContainer = el.querySelector('#card-number') as HTMLElement
        const cardExpiryContainer = el.querySelector('#card-expiry') as HTMLElement
        const cardCvcContainer = el.querySelector('#card-cvc') as HTMLElement

        if (!cardNumberContainer || !cardExpiryContainer || !cardCvcContainer) {
          throw new Error('Required DOM elements are missing. Make sure #card-number, #card-expiry, and #card-cvc exist.')
        }

        // カード番号要素の作成とマウント
        this.cardNumber = elements.create('cardNumber', {
          placeholder: i18n.t('Card Number'),
        });
        await this.cardNumber.mount(cardNumberContainer);
        this.cardNumber.on('change', handleCardError);

        // 有効期限要素の作成とマウント
        this.cardExpiry = elements.create('cardExpiry');
        await this.cardExpiry.mount(cardExpiryContainer);
        this.cardExpiry.on('change', handleCardError);

        // CVCコード要素の作成とマウント
        this.cardCVC = elements.create('cardCvc');
        await this.cardCVC.mount(cardCvcContainer);
        this.cardCVC.on('change', handleCardError);

      } catch (error) {
        console.error('Failed to initialize Stripe card elements:', error);
        stripeStore.set('errorMessage', error.message);
        throw error;
      }
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
  
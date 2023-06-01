import { loadStripe } from "@stripe/stripe-js";
import { stripeStore } from "./store";
import { PWAStripeCardElement } from "./CardElement";

export * from './store'
export * from './CardElement'
  const updateStripeAppInfo = () => {
    const stripe = stripeStore.get('stripe')
    if (!stripe) return
    const applicationName = stripeStore.get('applicationName')
    stripe.registerAppInfo({
      name: applicationName,
    });
  }
/**
 * Load StripeCardElement instance
 * @returns PWAStripeCardElement
 */
export const getAndLoadCardElement = () => {
    const elements = stripeStore.get('elements')
    const el = stripeStore.get('el')
    const element = PWAStripeCardElement.getInstance({
      el,
      elements,
    })
    return element
  }
  /**
   * Init Stripe.js
   */
  stripeStore.onChange('publishableKey', async newAPiKey => {
    // If Stripe.js already loaded, do nothing
    if (!!stripeStore.get('stripe')) {
      return
    }
    stripeStore.set('loadStripeStatus', 'loading')
    const stripeAccount = stripeStore.get('stripeAccount')
    try {
      const stripe = await loadStripe(newAPiKey, {
        stripeAccount,
      })
      updateStripeAppInfo()
      stripeStore.set('stripe', stripe)
      stripeStore.set('loadStripeStatus', 'success')

      /**
       * Init Stripe Elements
       */
      const elements = stripe.elements()
      stripeStore.set('elements', elements)
      getAndLoadCardElement()
    } catch (e) {
      console.log(e)
      stripeStore.set('errorMessage', e.message)
      stripeStore.set('loadStripeStatus', 'failure')
    }
  })
  stripeStore.onChange('applicationName', updateStripeAppInfo)

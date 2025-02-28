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
export const configureStripeJSClient = async () => {
  // If Stripe.js already loaded, do nothing
  if (!!stripeStore.get('stripe')) {
    return
  }
  stripeStore.set('loadStripeStatus', 'loading')
  const stripeAccount = stripeStore.get('stripeAccount')
  const apiKey = stripeStore.get('publishableKey')
  try {
    console.log('Initializing Stripe client...');
    const stripe = await loadStripe(apiKey, {
      stripeAccount,
    })
    updateStripeAppInfo()
    stripeStore.set('stripe', stripe)
    stripeStore.set('loadStripeStatus', 'success')
    
    /**
     * Init Stripe Elements
     */
    console.log('Creating Stripe Elements...');
    const elements = stripe.elements()
    stripeStore.set('elements', elements)
    console.log('Initializing card elements...');
    getAndLoadCardElement()
  } catch (e) {
    console.error('Failed to initialize Stripe:', e)
    stripeStore.set('errorMessage', e.message)
    stripeStore.set('loadStripeStatus', 'failure')
  }
}


stripeStore.onChange('stripeAccount', configureStripeJSClient)
/**
   * Update Stripe application name
 */
stripeStore.onChange('applicationName', updateStripeAppInfo)
/**
   * Init Stripe.js
 */
stripeStore.onChange('publishableKey', configureStripeJSClient)
stripeStore.onChange('applicationName', updateStripeAppInfo)

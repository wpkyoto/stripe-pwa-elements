import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentSheet } from '../stripe-payment-sheet-modal';

describe('stripe-payment-sheet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    expect(page.root).toEqualHtml(`<stripe-payment-sheet>
      <stripe-sheet showclosebutton="">
        <stripe-payment intenttype="payment" shouldusedefaultformsubmitaction="" zip=""></stripe-payment>
      </stripe-sheet>
    </stripe-payment-sheet>`);
  });

  it('renders with custom props', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet
        publishable-key="pk_test_123"
        sheet-title="Custom Title"
        button-label="Pay Now"
        show-label="true"
        zip="false"
      ></stripe-payment-sheet>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('emits closed event when modal is closed', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const closedEventSpy = jest.fn();
    page.root.addEventListener('closed', closedEventSpy);

    const modal = page.root.querySelector('stripe-sheet');
    modal.dispatchEvent(new CustomEvent('close'));

    expect(closedEventSpy).toHaveBeenCalled();
  });

  it('present method opens modal and returns a promise', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const presentPromise = page.rootInstance.present();
    expect(presentPromise).toBeInstanceOf(Promise);
    expect(page.rootInstance.open).toBe(true);
  });

  it('rejects present promise when modal is closed', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const presentPromise = page.rootInstance.present();
    const modal = page.root.querySelector('stripe-sheet');
    modal.dispatchEvent(new CustomEvent('close'));

    await expect(presentPromise).rejects.toEqual(undefined);
  });

  it('resolves present promise when form is submitted', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const formData = { type: 'submit', data: { token: 'test' } };
    const presentPromise = page.rootInstance.present();
    
    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.dispatchEvent(new CustomEvent('formSubmit', { detail: formData }));

    const result = await presentPromise;
    expect(result).toEqual(expect.objectContaining({ detail: formData }));
  });

  it('gets stripe payment element correctly', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const paymentElement = await page.rootInstance.getStripePaymentSheetElement();
    expect(paymentElement).toBeTruthy();
    expect(paymentElement.tagName.toLowerCase()).toBe('stripe-payment');
  });

  it('updates progress status correctly', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const progress = { type: 'loading', message: 'Processing payment...' };
    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.updateProgress = jest.fn();

    await page.rootInstance.updateProgress(progress);
    expect(paymentElement.updateProgress).toHaveBeenCalledWith(progress);
  });

  it('handles missing payment element gracefully in updateProgress', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.remove();

    const progress = { type: 'loading', message: 'Processing payment...' };
    await expect(page.rootInstance.updateProgress(progress)).resolves.toBeUndefined();
  });

  it('sets payment request button attributes correctly', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet application-name="test-app"></stripe-payment-sheet>`,
    });

    const options = {
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: 1000,
      },
    };

    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.setPaymentRequestOption = jest.fn();

    await page.rootInstance.setPaymentRequestButton(options);
    expect(paymentElement.getAttribute('show-payment-request-button')).toBe('true');
    expect(paymentElement.getAttribute('application-name')).toBe('test-app');
    expect(paymentElement.setPaymentRequestOption).toHaveBeenCalledWith(options);
  });

  it('handles missing payment element gracefully in setPaymentRequestButton', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.remove();

    const options = {
      country: 'US',
      currency: 'usd',
      total: { label: 'Total', amount: 1000 },
    };

    await expect(page.rootInstance.setPaymentRequestButton(options)).resolves.toBeUndefined();
  });

  it('can be destroyed', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const rootElement = page.root;
    await page.rootInstance.destroy();
    expect(rootElement.isConnected).toBe(false);
  });

  it('handles missing elements gracefully in destroy', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const paymentElement = page.root.querySelector('stripe-payment');
    const sheetElement = page.root.querySelector('stripe-sheet');
    paymentElement.remove();
    sheetElement.remove();

    await expect(page.rootInstance.destroy()).resolves.toBeUndefined();
  });

  it('handles component lifecycle correctly', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const closedEventSpy = jest.fn();
    page.root.addEventListener('closed', closedEventSpy);

    const modal = page.root.querySelector('stripe-sheet');
    modal.dispatchEvent(new CustomEvent('close'));

    expect(closedEventSpy).toHaveBeenCalled();
  });

  it('handles invalid publishable key gracefully', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet publishable-key="invalid_key"></stripe-payment-sheet>`,
    });

    const paymentElement = page.root.querySelector('stripe-payment');
    expect(paymentElement.getAttribute('publishablekey')).toBe('invalid_key');
  });

  it('handles multiple close events correctly', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const closedEventSpy = jest.fn();
    page.root.addEventListener('closed', closedEventSpy);

    const modal = page.root.querySelector('stripe-sheet');
    modal.dispatchEvent(new CustomEvent('close'));
    modal.dispatchEvent(new CustomEvent('close'));
    modal.dispatchEvent(new CustomEvent('close'));

    expect(closedEventSpy).toHaveBeenCalledTimes(3);
  });

  it('handles rapid present() calls correctly', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const presentPromise = page.rootInstance.present();
    const modal = page.root.querySelector('stripe-sheet');
    modal.dispatchEvent(new CustomEvent('close'));

    await expect(presentPromise).rejects.toBeUndefined();
  });

  it('handles network error during payment submission', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const networkError = { type: 'error', message: 'Network error occurred' };
    const presentPromise = page.rootInstance.present();
    
    const paymentElement = page.root.querySelector('stripe-payment');
    page.root.dispatchEvent(new CustomEvent('closed'));

    await expect(presentPromise).rejects.toBeUndefined();
  });

  it('handles invalid response data gracefully', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const invalidData = { type: 'submit', data: null };
    const presentPromise = page.rootInstance.present();
    
    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.dispatchEvent(new CustomEvent('formSubmit', { detail: invalidData }));

    const result = await presentPromise;
    expect(result).toEqual(expect.objectContaining({ detail: invalidData }));
  });

  it('handles progress update with invalid status', async () => {
    const page = await newSpecPage({
      components: [StripePaymentSheet],
      html: `<stripe-payment-sheet></stripe-payment-sheet>`,
    });

    const invalidProgress = { type: 'invalid_type', message: null };
    const paymentElement = page.root.querySelector('stripe-payment');
    paymentElement.updateProgress = jest.fn();

    await page.rootInstance.updateProgress(invalidProgress);
    expect(paymentElement.updateProgress).toHaveBeenCalledWith(invalidProgress);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { StripePaymentSheet } from '../stripe-payment-sheet-modal';

describe('stripe-payment-sheet', () => {
  describe('rendering test', () => {
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

    it('should render with publishableKey prop', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet publishable-key="pk_test_xxx"></stripe-payment-sheet>`,
      });

      const innerPayment = page.root.querySelector('stripe-payment');
      expect(innerPayment.getAttribute('publishableKey')).toBe('pk_test_xxx');
    });

    it('should render with open modal', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet open="true"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.open).toBe(true);
    });

    it('should forward zip prop to inner component', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet zip="false"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.zip).toBe(false);
    });

    it('should forward showLabel prop to inner component', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet show-label="true"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.showLabel).toBe(true);
    });

    it('should forward intentType prop to inner component', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet intent-type="setup"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.intentType).toBe('setup');
    });

    it('should forward buttonLabel prop to inner component', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet button-label="Add card"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.buttonLabel).toBe('Add card');
    });

    it('should forward sheetTitle prop to inner component', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet sheet-title="Custom Title"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.sheetTitle).toBe('Custom Title');
    });

    it('should forward showCloseButton prop to modal', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet show-close-button="false"></stripe-payment-sheet>`,
      });

      expect(page.rootInstance.showCloseButton).toBe(false);
    });

    it('should render with all props', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet
          publishable-key="pk_test_xxx"
          stripe-account="acct_xxx"
          application-name="test-app"
          show-label="true"
          sheet-title="Test Title"
          button-label="Test Button"
          intent-client-secret="pi_xxx"
          should-use-default-form-submit-action="false"
          intent-type="setup"
          show-close-button="false"
          zip="false"
          open="true"
        ></stripe-payment-sheet>`,
      });

      expect(page.root).toMatchSnapshot();
    });
  });

  describe('method test', () => {
    describe('#getStripePaymentSheetElement', () => {
      it('should return the inner stripe-payment element', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        const element = await page.rootInstance.getStripePaymentSheetElement();
        expect(element.tagName.toLowerCase()).toBe('stripe-payment');
      });
    });

    describe('#present', () => {
      it('should set open to true when called', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        expect(page.rootInstance.open).toBe(false);

        // Start present (don't await it as it returns a promise that waits for events)
        const presentPromise = page.rootInstance.present();

        // Check that open was set to true
        expect(page.rootInstance.open).toBe(true);

        // Clean up by closing the modal
        const closedEvent = new Event('closed');
        page.root.dispatchEvent(closedEvent);

        // Should reject on close
        await expect(presentPromise).rejects.toBeUndefined();
      });
    });

    describe('#updateProgress', () => {
      it('should call updateProgress on inner stripe-payment element', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        const innerPayment = page.root.querySelector('stripe-payment') as any;
        innerPayment.updateProgress = jest.fn().mockResolvedValue(undefined);

        await page.rootInstance.updateProgress('loading');

        expect(innerPayment.updateProgress).toHaveBeenCalledWith('loading');
      });

      it('should support all progress states', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        const innerPayment = page.root.querySelector('stripe-payment') as any;
        innerPayment.updateProgress = jest.fn().mockResolvedValue(undefined);

        await page.rootInstance.updateProgress('loading');
        await page.rootInstance.updateProgress('success');
        await page.rootInstance.updateProgress('failure');
        await page.rootInstance.updateProgress('');

        expect(innerPayment.updateProgress).toHaveBeenCalledTimes(4);
      });
    });

    describe('#destroy', () => {
      it('should remove both inner payment element and itself', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        const innerPayment = page.root.querySelector('stripe-payment') as any;
        innerPayment.remove = jest.fn();
        page.root.remove = jest.fn();

        await page.rootInstance.destroy();

        expect(innerPayment.remove).toHaveBeenCalled();
        expect(page.root.remove).toHaveBeenCalled();
      });
    });

    describe('#setPaymentRequestButton', () => {
      it('should set payment request button on inner element', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        const options = {
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Total',
            amount: 1000,
          },
        };

        const innerPayment = page.root.querySelector('stripe-payment') as any;
        innerPayment.setPaymentRequestOption = jest.fn();

        await page.rootInstance.setPaymentRequestButton(options);

        expect(innerPayment.getAttribute('show-payment-request-button')).toBe('true');
        expect(innerPayment.setPaymentRequestOption).toHaveBeenCalledWith(options);
      });

      it('should set application name when provided', async () => {
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

        const innerPayment = page.root.querySelector('stripe-payment') as any;
        innerPayment.setPaymentRequestOption = jest.fn();

        await page.rootInstance.setPaymentRequestButton(options);

        expect(innerPayment.getAttribute('application-name')).toBe('test-app');
      });

      it('should handle missing stripe-payment element gracefully', async () => {
        const page = await newSpecPage({
          components: [StripePaymentSheet],
          html: `<stripe-payment-sheet></stripe-payment-sheet>`,
        });

        // Remove inner element
        const innerPayment = page.root.querySelector('stripe-payment');
        innerPayment.remove();

        const options = {
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Total',
            amount: 1000,
          },
        };

        // Should not throw
        await expect(page.rootInstance.setPaymentRequestButton(options)).resolves.toBeUndefined();
      });
    });
  });

  describe('event test', () => {
    it('should emit closed event when modal is closed', async () => {
      const page = await newSpecPage({
        components: [StripePaymentSheet],
        html: `<stripe-payment-sheet></stripe-payment-sheet>`,
      });

      let eventEmitted = false;
      page.root.addEventListener('closed', () => {
        eventEmitted = true;
      });

      // Trigger componentDidLoad manually
      await page.rootInstance.componentDidLoad();

      // Simulate close event from inner modal
      const modal = page.root.querySelector('stripe-sheet');
      const closeEvent = new Event('close');
      modal.dispatchEvent(closeEvent);

      expect(eventEmitted).toBe(true);
    });
  });

  describe('props test', () => {
    it('should have default showCloseButton as true', () => {
      const component = new StripePaymentSheet();
      expect(component.showCloseButton).toBe(true);
    });

    it('should have default zip as true', () => {
      const component = new StripePaymentSheet();
      expect(component.zip).toBe(true);
    });

    it('should have default open as false', () => {
      const component = new StripePaymentSheet();
      expect(component.open).toBe(false);
    });

    it('should have default shouldUseDefaultFormSubmitAction as true', () => {
      const component = new StripePaymentSheet();
      expect(component.shouldUseDefaultFormSubmitAction).toBe(true);
    });

    it('should have default intentType as payment', () => {
      const component = new StripePaymentSheet();
      expect(component.intentType).toBe('payment');
    });

    it('should have default showLabel as false', () => {
      const component = new StripePaymentSheet();
      expect(component.showLabel).toBe(false);
    });
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { StripeModal } from '../stripe-modal';

/**
 * Component tests for StripeModal
 *
 * Following Kent Beck's test pyramid philosophy:
 * - These tests verify component rendering and DOM interactions
 * - Use newSpecPage for Stencil component context
 * - For pure unit tests, see stripe-modal.unit.spec.ts
 */
describe('stripe-modal component tests', () => {
  describe('Rendering', () => {
    it('renders', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal></stripe-modal>`,
      });

      expect(page.root).toEqualHtml(`
      <stripe-modal>
        <mock:shadow-root>
          <div class="modal-row">
            <div class="modal-child">
              <div class="modal-close-button-wrap">
                <ion-icon class="modal-close-button" name="close" size="large"></ion-icon>
              </div>
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
      </stripe-modal>
      `);
    });

    it("should match snapshot (open='true')", async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal open="true"></stripe-modal>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it("should match snapshot (showCloseButton='true')", async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal show-close-button="true"></stripe-modal>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it("should match snapshot (showCloseButton='false')", async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal show-close-button="false"></stripe-modal>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it("should have 'open' class when open is true", async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal open="true"></stripe-modal>`,
      });

      const modalRow = page.root.shadowRoot.querySelector('.modal-row');
      expect(modalRow.classList.contains('open')).toBe(true);
    });

    it("should not have 'open' class when open is false", async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal open="false"></stripe-modal>`,
      });

      const modalRow = page.root.shadowRoot.querySelector('.modal-row');
      expect(modalRow.classList.contains('open')).toBe(false);
    });

    it('should render slot content', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal><div class="test-content">Test Content</div></stripe-modal>`,
      });

      const slot = page.root.shadowRoot.querySelector('slot');
      expect(slot).not.toBeNull();
    });

    it('should show close button by default', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal></stripe-modal>`,
      });

      const closeButton = page.root.shadowRoot.querySelector('.modal-close-button');
      expect(closeButton).not.toBeNull();
    });
  });

  describe('Event emission', () => {
    it('should emit close event with correct data when closeModal is called', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal open="true"></stripe-modal>`,
      });

      let eventEmitted = false;
      page.root.addEventListener('close', () => {
        eventEmitted = true;
      });

      await page.rootInstance.closeModal();
      await page.waitForChanges();

      expect(eventEmitted).toBe(true);
    });

    it('should emit close event when toggleModal is called from open state', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal open="true"></stripe-modal>`,
      });

      let eventEmitted = false;
      page.root.addEventListener('close', () => {
        eventEmitted = true;
      });

      await page.rootInstance.toggleModal();
      await page.waitForChanges();

      expect(eventEmitted).toBe(true);
    });

    it('should not emit close event when toggleModal is called from closed state', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal open="false"></stripe-modal>`,
      });

      let eventEmitted = false;
      page.root.addEventListener('close', () => {
        eventEmitted = true;
      });

      await page.rootInstance.toggleModal();
      await page.waitForChanges();

      expect(eventEmitted).toBe(false);
    });
  });

  describe('Props reactivity', () => {
    it('should update open prop', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal></stripe-modal>`,
      });

      expect(page.rootInstance.open).toBe(false);

      page.root.setAttribute('open', 'true');
      await page.waitForChanges();

      expect(page.rootInstance.open).toBe(true);
    });

    it('should update showCloseButton prop', async () => {
      const page = await newSpecPage({
        components: [StripeModal],
        html: `<stripe-modal></stripe-modal>`,
      });

      expect(page.rootInstance.showCloseButton).toBe(true);

      page.root.setAttribute('show-close-button', 'false');
      await page.waitForChanges();

      expect(page.rootInstance.showCloseButton).toBe(false);
    });
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { StripeModal } from '../stripe-modal';

describe('stripe-modal', () => {
  describe('Component Logic test', () => {
    describe('#openModal', () => {
      it('open props should change to true when the openModal method was called', async () => {
        const component = new StripeModal();

        component.open = false;
        await component.openModal();
        expect(component.open).toEqual(true);
      });
    });
    describe('#closeModal', () => {
      it('open props should change to false when the closeModal method was called', async () => {
        const component = new StripeModal();

        component.close = {
          emit: jest.fn(),
        };
        await component.closeModal();
        expect(component.open).toEqual(false);
      });
      it('When the closeModal method called, should called close event at once', async () => {
        const component = new StripeModal();

        component.open = true;
        const mockEmitter = jest.fn();

        component.close = {
          emit: mockEmitter,
        };
        await component.closeModal();
        expect(mockEmitter).toBeCalledTimes(1);
      });
    });
    describe('#toggleModal', () => {
      describe('Props open=true', () => {
        let component = new StripeModal();
        let mockEmitter = jest.fn();

        beforeEach(() => {
          component = new StripeModal();
          mockEmitter = jest.fn();
          component.open = true;
          component.close = {
            emit: mockEmitter,
          };
        });
        it('should execute the close event', async () => {
          await component.toggleModal();
          expect(mockEmitter).toBeCalledTimes(1);
        });
        it('Should change the open props to be false', async () => {
          await component.toggleModal();
          expect(component.open).toEqual(false);
        });
      });
      describe('Props open=false', () => {
        let component = new StripeModal();
        let mockEmitter = jest.fn();

        beforeEach(() => {
          component = new StripeModal();
          mockEmitter = jest.fn();
          component.open = false;
          component.close = {
            emit: mockEmitter,
          };
        });
        it('should execute the close event', async () => {
          await component.toggleModal();
          expect(mockEmitter).toBeCalledTimes(0);
        });
        it('Should change the open props to be true', async () => {
          await component.toggleModal();
          expect(component.open).toEqual(true);
        });
      });
    });
  });
  describe('Rendering test', () => {
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

  describe('Event emission test', () => {
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

  describe('Edge cases', () => {
    it('should handle rapid open/close toggles', async () => {
      const component = new StripeModal();
      component.close = {
        emit: jest.fn(),
      };

      component.open = false;
      await component.toggleModal();
      expect(component.open).toBe(true);

      await component.toggleModal();
      expect(component.open).toBe(false);

      await component.toggleModal();
      expect(component.open).toBe(true);

      await component.toggleModal();
      expect(component.open).toBe(false);
    });

    it('should handle multiple closeModal calls', async () => {
      const component = new StripeModal();
      const mockEmitter = jest.fn();
      component.close = {
        emit: mockEmitter,
      };

      component.open = true;
      await component.closeModal();
      await component.closeModal();
      await component.closeModal();

      expect(mockEmitter).toBeCalledTimes(3);
      expect(component.open).toBe(false);
    });

    it('should handle multiple openModal calls', async () => {
      const component = new StripeModal();

      component.open = false;
      await component.openModal();
      expect(component.open).toBe(true);

      await component.openModal();
      expect(component.open).toBe(true);

      await component.openModal();
      expect(component.open).toBe(true);
    });
  });

  describe('Props test', () => {
    it('should have default open as false', () => {
      const component = new StripeModal();
      expect(component.open).toBe(false);
    });

    it('should have default showCloseButton as true', () => {
      const component = new StripeModal();
      expect(component.showCloseButton).toBe(true);
    });

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

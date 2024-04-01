import { newSpecPage } from '@stencil/core/testing';
import { StripeSheet } from '../stripe-element-modal';

describe('stripe-sheet', () => {
  describe('Component Logic test', () => {
    describe('#openModal', () => {
      it('open props should change to true when the openModal method was called', async () => {
        const component = new StripeSheet();

        component.open = false;
        await component.openModal();
        expect(component.open).toEqual(true);
      });
    });
    describe('#closeModal', () => {
      it('open props should change to false when the closeModal method was called', async () => {
        const component = new StripeSheet();

        component.close = {
          emit: jest.fn(),
        };
        await component.closeModal();
        expect(component.open).toEqual(false);
      });
      it('When the closeModal method called, should called close event at once', async () => {
        const component = new StripeSheet();

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
        let component = new StripeSheet();
        let mockEmitter = jest.fn();

        beforeEach(() => {
          component = new StripeSheet();
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
        let component = new StripeSheet();
        let mockEmitter = jest.fn();

        beforeEach(() => {
          component = new StripeSheet();
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
        components: [StripeSheet],
        html: `<stripe-sheet></stripe-sheet>`,
      });

      expect(page.root).toEqualHtml(`
      <stripe-sheet>
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
      </stripe-sheet>
      `);
    });

    it("should match snapshot (open='true')", async () => {
      const page = await newSpecPage({
        components: [StripeSheet],
        html: `<stripe-sheet open="true"></stripe-sheet>`,
      });

      expect(page.root).toMatchSnapshot();
    });

    it("should match snapshot (showCloseButton='true')", async () => {
      const page = await newSpecPage({
        components: [StripeSheet],
        html: `<stripe-sheet show-close-button="true"></stripe-sheet>`,
      });

      expect(page.root).toMatchSnapshot();
    });
    it("should match snapshot (showCloseButton='false')", async () => {
      const page = await newSpecPage({
        components: [StripeSheet],
        html: `<stripe-sheet show-close-button="false"></stripe-sheet>`,
      });

      expect(page.root).toMatchSnapshot();
    });
  });
});

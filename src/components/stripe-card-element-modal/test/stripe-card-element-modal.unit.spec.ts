import { StripeCardElementModal } from '../stripe-card-element-modal';

/**
 * Unit tests for StripeCardElementModal component
 *
 * Following Kent Beck's test pyramid philosophy:
 * - These are pure unit tests that test class logic in isolation
 * - No DOM rendering, no Stencil page context
 * - Fast, isolated, deterministic
 */
describe('stripe-card-element-modal unit tests', () => {
  describe('Default props', () => {
    it('should have default showCloseButton as true', () => {
      const component = new StripeCardElementModal();
      expect(component.showCloseButton).toBe(true);
    });

    it('should have default zip as true', () => {
      const component = new StripeCardElementModal();
      expect(component.zip).toBe(true);
    });

    it('should have default open as false', () => {
      const component = new StripeCardElementModal();
      expect(component.open).toBe(false);
    });

    it('should have default shouldUseDefaultFormSubmitAction as true', () => {
      const component = new StripeCardElementModal();
      expect(component.shouldUseDefaultFormSubmitAction).toBe(true);
    });

    it('should have default intentType as payment', () => {
      const component = new StripeCardElementModal();
      expect(component.intentType).toBe('payment');
    });

    it('should have default showLabel as false', () => {
      const component = new StripeCardElementModal();
      expect(component.showLabel).toBe(false);
    });
  });
});

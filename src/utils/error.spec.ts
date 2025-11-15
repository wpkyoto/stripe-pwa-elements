import { StripeAPIError } from './error';
import { StripeError } from '@stripe/stripe-js';

describe('StripeAPIError', () => {
  describe('constructor', () => {
    it('should create an error with all Stripe error properties', () => {
      const stripeError: StripeError = {
        type: 'card_error',
        code: 'card_declined',
        message: 'Your card was declined.',
        param: 'card_number',
        doc_url: 'https://stripe.com/docs/error-codes/card-declined',
      };

      const error = new StripeAPIError(stripeError);

      expect(error).toBeInstanceOf(Error);
      expect(error.type).toEqual('card_error');
      expect(error.code).toEqual('card_declined');
      expect(error.message).toEqual('Your card was declined.');
      expect(error.param).toEqual('card_number');
      expect(error.docUrl).toEqual('https://stripe.com/docs/error-codes/card-declined');
    });

    it('should handle errors with missing optional properties', () => {
      const stripeError: StripeError = {
        type: 'api_error',
        message: 'An error occurred',
      };

      const error = new StripeAPIError(stripeError);

      expect(error.type).toEqual('api_error');
      expect(error.message).toEqual('An error occurred');
      expect(error.code).toBeUndefined();
      expect(error.param).toBeUndefined();
      expect(error.docUrl).toBeUndefined();
    });

    it('should handle validation errors', () => {
      const stripeError: StripeError = {
        type: 'validation_error',
        code: 'parameter_invalid_empty',
        message: 'You must provide a source or customer.',
        param: 'source',
      };

      const error = new StripeAPIError(stripeError);

      expect(error.type).toEqual('validation_error');
      expect(error.code).toEqual('parameter_invalid_empty');
      expect(error.message).toEqual('You must provide a source or customer.');
      expect(error.param).toEqual('source');
    });

    it('should handle authentication errors', () => {
      const stripeError: StripeError = {
        type: 'authentication_error',
        code: 'invalid_api_key',
        message: 'Invalid API Key provided',
      };

      const error = new StripeAPIError(stripeError);

      expect(error.type).toEqual('authentication_error');
      expect(error.code).toEqual('invalid_api_key');
      expect(error.message).toEqual('Invalid API Key provided');
    });

    it('should handle rate limit errors', () => {
      const stripeError: StripeError = {
        type: 'rate_limit_error',
        message: 'Too many requests made to the API too quickly',
      };

      const error = new StripeAPIError(stripeError);

      expect(error.type).toEqual('rate_limit_error');
      expect(error.message).toEqual('Too many requests made to the API too quickly');
    });
  });
});

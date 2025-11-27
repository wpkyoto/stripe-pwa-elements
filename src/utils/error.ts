import { StripeError } from '@stripe/stripe-js';

export class StripeAPIError extends Error {
  code: string;
  docUrl: string;
  message: string;
  param: string;
  requestLogUrl: string;
  type: string;

  constructor(error: StripeError) {
    super(error.message);
    this.code = error.code;
    this.docUrl = error.doc_url;
    this.message = error.message;
    this.param = error.param;
    this.requestLogUrl = error.request_log_url;
    this.type = error.type;
  }
}

/**
 * Error thrown when an element is not found in the DOM within the timeout period
 */
export class ElementNotFoundError extends Error {
  selector: string;
  timeout: number;

  constructor(selector: string, timeout: number) {
    super(`Element "${selector}" not found within ${timeout}ms`);
    this.name = 'ElementNotFoundError';
    this.selector = selector;
    this.timeout = timeout;
  }
}

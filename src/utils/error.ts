import { StripeError } from "@stripe/stripe-js";

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
      //this.requestLogUrl = error.request_log_url;
      this.type = error.type;
    }
}

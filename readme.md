![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# @stripe-elements/stripe-elements


## Maintainers

| Maintainer | GitHub | Social |
| --- | --- | --- |
| Hidetaka Okamoto | [Hidetaka Okamoto](https://github.com/hideokamoto) | [@hide__dev](https://twitter.com/hide__dev) |
| Masaki Hirano | [hirano](https://github.com/contiki9) | [@maki_saki](https://twitter.com/maki_saki) |
| Masahiko Sakakibara | [rdlabo](https://github.com/rdlabo) | [@rdlabo](https://twitter.com/rdlabo) |

## Installation


## Components

### `<stripe-payment-sheet>`

Provide a Stripe Card form like a iOS/Android payment sheet.

https://github.com/stripe-elements/stripe-elements/blob/main/src/components/stripe-payment-sheet/readme.md

### `<stripe-element-modal>`

Simple modal for `<stripe-payment-sheet>`

https://github.com/stripe-elements/stripe-elements/blob/main/src/components/stripe-element-modal/readme.md

### `stripe-payment-request-button`

(Beta) Payment Request button component

https://github.com/stripe-elements/stripe-elements/blob/main/src/components/stripe-payment-request-button/readme.md

## Usage

### HTML

```html
      <div id="result"></div>

      <stripe-element-modal open="true">
          <stripe-payment-sheet
            publishable-key="pk_test_xxxxx"
            show-label="false"
            intent-client-secret="pi-xxxxxx"
            should-use-default-form-submit-action="false"
          ></stripe-payment-sheet>
      </stripe-element-modal>
    
    <script>
        customElements.whenDefined('stripe-payment-sheet')
            .then(() => {
                const elements = document.getElementsByTagName('stripe-payment-sheet')
                if (elements.length < 1) return;
                const element = elements[0]
                element.addEventListener('formSubmit', async props => {
                const {
                    detail: { stripe, cardNumber, event },
                } = props;
                const result = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardNumber,
                });
                element.updateProgress('success');

                const resultElement = document.getElementById('result')
                resultElement.innerHTML = `<pre><code>${JSON.stringify(result,null,2)}</code></pre>`
            });

        })
    </script>
```

### JavaScript


```javascript
        const stripePublishableAPIKey = 'YOUR_STRIPE_PUBLISHABLE_API_KEY'

        const form = document.getElementById('open-modal-form')
        const resultElement = document.getElementById('result')
        const errorMessage = document.getElementById('error-message')
        const targetElement = document.getElementById('stripe');
        const modalElement = document.createElement('stripe-element-modal');

        /**
         * Remove Mounted Stripe Elements when the modal has been closed
         **/
        customElements.whenDefined('stripe-element-modal')
            .then(() => {
                modalElement.addEventListener('close', () => {
                    modalElement.innerHTML = ''
                })
            })
        
        async function launchStripePaymentSheet (paymentIntentClientSecret) {
            if (!stripePublishableAPIKey) {
                errorMessage.innerText = 'Stripe Publishable API Key is required'
                return
            }
            if (!paymentIntentClientSecret) {
                errorMessage.innerText = 'Payment Intent Client Secret is required'
                return
            }

            /**
             * Define and launch Web Components
             **/
            const stripeElement = document.createElement('stripe-payment-sheet');
            modalElement.appendChild(stripeElement);
            targetElement.appendChild(modalElement);

            /**
             * Wait for defining these components
             **/
            await customElements.whenDefined('stripe-element-modal')
            await customElements.whenDefined('stripe-payment-sheet')
            
            /**
             * Load Stripe Client
             **/
            await stripeElement.initStripe(stripePublishableAPIKey)


            /**
             * Set the payment intent client secret
             **/
            stripeElement.setAttribute('intent-client-secret', paymentIntentClientSecret)

            /**
             * Disable default form submit event
             **/
            stripeElement.setAttribute('should-use-default-form-submit-action', false);

            /**
             * Set custom form submit event manually
             **/
            stripeElement.addEventListener('formSubmit', async props => {
              const {
                detail: { stripe, cardNumber, event },
              } = props;
              const result = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumber,
              });
              resultElement.innerHTML = `<pre><code>${JSON.stringify(result,null,2)}</code></pre>`
              stripeElement.updateProgress('success');
              await modalElement.closeModal()
            });

            /**
             * Open modal
             **/
            modalElement.setAttribute('open', true)
        })
```

## Contribution

### Getting Started
```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```
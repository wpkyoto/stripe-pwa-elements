import { Component, Host, h, Prop, Method } from '@stencil/core';

@Component({
  tag: 'stripe-element-modal',
  styleUrl: 'stripe-element-modal.css',
  shadow: true,
})
export class StripeElementModal {

  @Prop() showCloseButton: boolean = true;

  /**
   * Modal state.
   * If true, the modal will open
   */
  @Prop() open: boolean = false;

  /**
   * Toggle modal state
   */
  @Method()
  public async toggleModal() {
    this.open = !this.open
  }

  /**
   * Open the modal
   */
  @Method()
  public async openModal() {
    this.open = true
  }

  /**
   * Close the modal
   */
  @Method()
  public async closeModal() {
    this.open = false
  }


  render() {
    const { open, showCloseButton } = this
    return (
      <Host>
        <div class={`modal-row${open ? ' open': ''}`} onClick={() => this.closeModal()}>
          <div class="modal-child" onClick={e => e.stopPropagation()}>
            <slot></slot>
            {showCloseButton ? (
              <button class="modal-close-button" onClick={() => this.closeModal()}>Close</button>
            ): null}
          </div>
        </div>
      </Host>
    );
  }

}

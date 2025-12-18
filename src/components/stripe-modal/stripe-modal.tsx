import { Component, Host, h, Prop, Method, Element, Event, EventEmitter } from '@stencil/core';
import { checkPlatform } from '../../utils/utils';

@Component({
  tag: 'stripe-modal',
  styleUrl: 'stripe-modal.scss',
  shadow: true,
})
export class StripeModal {
  @Element() el: HTMLStripeModalElement;

  /**
   * If true, the modal display close button
   */
  @Prop() showCloseButton = true;

  /**
   * Modal state.
   * If true, the modal will open
   */
  @Prop() open = false;

  /**
   * Toggle modal state
   */
  @Method()
  public async toggleModal() {
    this.open = !this.open;
    if (this.open === false) {
      this.close.emit();
    }
  }

  /**
   * Open the modal
   */
  @Method()
  public async openModal() {
    this.open = true;
  }

  /**
   * Close the modal
   */
  @Method()
  public async closeModal() {
    this.open = false;
    this.close.emit();
  }

  /**
   *
   */
  @Event() close: EventEmitter;

  componentDidLoad() {
    const platformName = checkPlatform();

    if (platformName) {this.el.classList.add(platformName);}
  }

  render() {
    const { open, showCloseButton } = this;

    return (
      <Host>
        <div class={`modal-row${open ? ' open' : ''}`} onClick={() => this.closeModal()}>
          <div class="modal-child" onClick={e => e.stopPropagation()}>
            {showCloseButton ? (
              <div class="modal-close-button-wrap">
                <ion-icon name="close" size="large" class="modal-close-button" onClick={() => this.closeModal()}></ion-icon>
              </div>
            ) : null}
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}

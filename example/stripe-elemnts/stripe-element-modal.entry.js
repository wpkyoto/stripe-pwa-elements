import { r as registerInstance, i as h, j as Host, k as getElement } from './index-4a7881a4.js';
import { c as checkPlatform } from './utils-95f328ba.js';
import './utils-232b7c49.js';
import './animation-941c301f.js';
import './helpers-345e0e01.js';
import './ios.transition-d9c7fa9a.js';
import './index-998e0975.js';
import './md.transition-76852d04.js';
import './cubic-bezier-ed243a9b.js';
import './index-da9ada32.js';
import './ionic-global-31b6ec25.js';
import './index-cc97b114.js';
import './index-21d8d915.js';
import './hardware-back-button-508e48cf.js';
import './overlays-ab5bcc5c.js';

const stripeElementModalCss = ":host{display:block}.modal-row{display:none}.modal-row.open{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:1ch;background:rgba(0, 0, 0, 0.3)}.modal-child{padding:1.5rem;background-color:#fff;width:100%}";

const StripeElementModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.showCloseButton = true;
    /**
     * Modal state.
     * If true, the modal will open
     */
    this.open = false;
  }
  /**
   * Toggle modal state
   */
  async toggleModal() {
    this.open = !this.open;
  }
  /**
   * Open the modal
   */
  async openModal() {
    this.open = true;
  }
  /**
   * Close the modal
   */
  async closeModal() {
    this.open = false;
  }
  componentDidLoad() {
    this.el.classList.add(checkPlatform());
  }
  render() {
    const { open, showCloseButton } = this;
    return (h(Host, null, h("div", { class: `modal-row${open ? ' open' : ''}`, onClick: () => this.closeModal() }, h("div", { class: "modal-child", onClick: e => e.stopPropagation() }, h("slot", null), showCloseButton ? (h("button", { class: "modal-close-button", onClick: () => this.closeModal() }, "Close")) : null))));
  }
  get el() { return getElement(this); }
};
StripeElementModal.style = stripeElementModalCss;

export { StripeElementModal as stripe_element_modal };

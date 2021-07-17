import { r as registerInstance, i as h, j as Host } from './index-4a7881a4.js';
import { g as getIonMode } from './ionic-global-31b6ec25.js';

const rowCss = ":host{display:flex;flex-wrap:wrap}";

const Row = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, { class: getIonMode(this) }, h("slot", null)));
  }
};
Row.style = rowCss;

export { Row as ion_row };

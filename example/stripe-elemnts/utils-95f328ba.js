import './utils-232b7c49.js';
import './animation-941c301f.js';
import './ios.transition-d9c7fa9a.js';
import './md.transition-76852d04.js';
import './cubic-bezier-ed243a9b.js';
import './index-da9ada32.js';
import { b as getPlatforms } from './ionic-global-31b6ec25.js';
import './helpers-345e0e01.js';
import './index-cc97b114.js';
import './index-998e0975.js';
import './index-21d8d915.js';
import './overlays-ab5bcc5c.js';

const setupConfig = (config) => {
  const win = window;
  const Ionic = win.Ionic;
  if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
    return;
  }
  win.Ionic = win.Ionic || {};
  win.Ionic.config = Object.assign(Object.assign({}, win.Ionic.config), config);
  return win.Ionic.config;
};
const getMode = () => {
  const win = window;
  const config = win && win.Ionic && win.Ionic.config;
  if (config) {
    if (config.mode) {
      return config.mode;
    }
    else {
      return config.get('mode');
    }
  }
  return 'md';
};

function format(first, middle, last) {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}
const checkPlatform = () => {
  const device = getPlatforms();
  if (device.includes('ios')) {
    return 'ios';
  }
  if (device.includes('android')) {
    return 'android';
  }
};

export { checkPlatform as c };

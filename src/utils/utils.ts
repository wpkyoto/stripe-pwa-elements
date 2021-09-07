import { getPlatforms } from './platform';

export const checkPlatform = () => {
  const device = getPlatforms();

  if (device.includes('ios')) {
    return 'ios';
  }

  if (device.includes('android')) {
    return 'android';
  }
};

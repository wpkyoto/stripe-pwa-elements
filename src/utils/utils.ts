import { getPlatforms } from '@ionic/core';

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const checkPlatform = () => {
  const device = getPlatforms();

  if (device.includes('ios')) {
    return 'ios';
  }

  if (device.includes('android')) {
    return 'android';
  }
};

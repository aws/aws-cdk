import { OSVersion, Platform } from '../lib';

describe('OS Version', () => {
  test('should return the correct OS version string', () => {
    expect(OSVersion.AMAZON_LINUX_2023.osVersion).toEqual('Amazon Linux 2023');
  });

  test('should return the correct OS version string for a custom OS', () => {
    const customOS = OSVersion.custom(Platform.LINUX, 'Custom OS');
    expect(customOS.osVersion).toEqual('Custom OS');
  });
});

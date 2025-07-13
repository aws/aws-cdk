import { InstanceClass, InstanceSize, InstanceType } from '../lib';

describe('InstanceType', () => {
  test('mac2 m1 ultra', () => {
    const instanceType = InstanceType.of(InstanceClass.MAC2_M1ULTRA, InstanceSize.METAL);
    expect(instanceType.toString()).toEqual('mac2-m1ultra.metal');
  });
});

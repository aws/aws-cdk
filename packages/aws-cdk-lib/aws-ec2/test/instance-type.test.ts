import { InstanceClass, InstanceSize, InstanceType } from '../lib';

describe('InstanceType', () => {
  test('mac2 m1 ultra', () => {
    const instanceType = InstanceType.of(InstanceClass.MAC2_M1ULTRA, InstanceSize.METAL);
    expect(instanceType.toString()).toEqual('mac2-m1ultra.metal');
  });

  test('c8a instance class', () => {
    const instanceType = InstanceType.of(InstanceClass.C8A, InstanceSize.LARGE);
    expect(instanceType.toString()).toEqual('c8a.large');
  });

  test('COMPUTE8_AMD instance class', () => {
    const instanceType = InstanceType.of(InstanceClass.COMPUTE8_AMD, InstanceSize.XLARGE);
    expect(instanceType.toString()).toEqual('c8a.xlarge');
  });
});

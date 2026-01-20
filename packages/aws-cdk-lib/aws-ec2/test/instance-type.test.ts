import { InstanceClass, InstanceSize, InstanceType } from '../lib';

describe('InstanceType', () => {
  test('mac2 m1 ultra', () => {
    const instanceType = InstanceType.of(InstanceClass.MAC2_M1ULTRA, InstanceSize.METAL);
    expect(instanceType.toString()).toEqual('mac2-m1ultra.metal');
  });

  test('c8a xlarge', () => {
    const instanceType = InstanceType.of(InstanceClass.C8A, InstanceSize.XLARGE);
    expect(instanceType.toString()).toEqual('c8a.xlarge');
  });

  test('compute8 amd xlarge', () => {
    const instanceType = InstanceType.of(InstanceClass.COMPUTE8_AMD, InstanceSize.XLARGE);
    expect(instanceType.toString()).toEqual('c8a.xlarge');
  });
});

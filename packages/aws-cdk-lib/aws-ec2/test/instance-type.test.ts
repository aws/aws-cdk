import { InstanceClass, InstanceSize, InstanceType } from '../lib';

describe('InstanceType', () => {
  test('mac2 m1 ultra', () => {
    const instanceType = InstanceType.of(InstanceClass.MAC2_M1ULTRA, InstanceSize.METAL);
    expect(instanceType.toString()).toEqual('mac2-m1ultra.metal');
  });

  test('C8A instance class', () => {
    expect(InstanceType.of(InstanceClass.C8A, InstanceSize.XLARGE).toString()).toEqual('c8a.xlarge');
    expect(InstanceType.of(InstanceClass.COMPUTE8_AMD, InstanceSize.LARGE).toString()).toEqual('c8a.large');
  });
});

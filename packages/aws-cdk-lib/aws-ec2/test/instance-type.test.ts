import { InstanceClass, InstanceSize, InstanceType } from '../lib';

describe('InstanceType', () => {
  test('mac2 m1 ultra', () => {
    const instanceType = InstanceType.of(InstanceClass.MAC2_M1ULTRA, InstanceSize.METAL);
    expect(instanceType.toString()).toEqual('mac2-m1ultra.metal');
  });

  test('c8a instance types', () => {
    const c8aLarge = InstanceType.of(InstanceClass.C8A, InstanceSize.LARGE);
    expect(c8aLarge.toString()).toEqual('c8a.large');

    const c8aXlarge = InstanceType.of(InstanceClass.C8A, InstanceSize.XLARGE);
    expect(c8aXlarge.toString()).toEqual('c8a.xlarge');

    const c8a2xlarge = InstanceType.of(InstanceClass.C8A, InstanceSize.XLARGE2);
    expect(c8a2xlarge.toString()).toEqual('c8a.2xlarge');
  });

  test('compute8-amd instance types', () => {
    const compute8AmdLarge = InstanceType.of(InstanceClass.COMPUTE8_AMD, InstanceSize.LARGE);
    expect(compute8AmdLarge.toString()).toEqual('compute8-amd.large');

    const compute8AmdXlarge = InstanceType.of(InstanceClass.COMPUTE8_AMD, InstanceSize.XLARGE);
    expect(compute8AmdXlarge.toString()).toEqual('compute8-amd.xlarge');
  });
});

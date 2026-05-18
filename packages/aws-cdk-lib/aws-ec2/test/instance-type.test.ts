import { InstanceClass, InstanceSize, InstanceType } from '../lib';

describe('InstanceType', () => {
  test.each([
    { instanceClass: InstanceClass.MAC2_M1ULTRA, size: InstanceSize.METAL, expected: 'mac2-m1ultra.metal' },
    { instanceClass: InstanceClass.C8A, size: InstanceSize.XLARGE, expected: 'c8a.xlarge' },
    { instanceClass: InstanceClass.COMPUTE8_AMD, size: InstanceSize.XLARGE, expected: 'c8a.xlarge' },
    { instanceClass: InstanceClass.G7E, size: InstanceSize.XLARGE48, expected: 'g7e.48xlarge' },
    { instanceClass: InstanceClass.GRAPHICS7_EFFICIENT, size: InstanceSize.XLARGE48, expected: 'g7e.48xlarge' },
    { instanceClass: InstanceClass.P6_B200, size: InstanceSize.XLARGE48METAL, expected: 'p6-b200.metal-48xl' },
    { instanceClass: InstanceClass.PARALLEL6_B200, size: InstanceSize.XLARGE48METAL, expected: 'p6-b200.metal-48xl' },
  ])('$expected instance type', (testData: { instanceClass: InstanceClass; size: InstanceSize; expected: string }) => {
    const instanceType = InstanceType.of(testData.instanceClass, testData.size);
    expect(instanceType.toString()).toEqual(testData.expected);
  });
});

import { InstanceClass, InstanceSize, InstanceType } from '../../../aws-ec2';
/**
 * This function check if the instanceType is GPU instance.
 * @param instanceType The EC2 instance type
 */
export function isGpuInstanceType(instanceType: InstanceType): boolean {
  // compare instanceType to known GPU InstanceTypes
  const knownGpuInstanceTypes = [InstanceClass.P2, InstanceClass.P3, InstanceClass.P3DN, InstanceClass.P4DE, InstanceClass.P4D,
    InstanceClass.G3S, InstanceClass.G3, InstanceClass.G4DN, InstanceClass.G4AD, InstanceClass.G5, InstanceClass.G5G, InstanceClass.G6,
    InstanceClass.G6E, InstanceClass.INF1, InstanceClass.INF2];
  return knownGpuInstanceTypes.some((c) => instanceType.sameInstanceClassAs(InstanceType.of(c, InstanceSize.LARGE)));
}

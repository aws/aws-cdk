import { InstanceClass, InstanceSize, InstanceType } from '../../../aws-ec2';
/**
 * This function check if the instanceType is GPU instance.
 * @param instanceType The EC2 instance type
 */
export function isGpuInstanceType(instanceType: InstanceType): boolean {
  // compare instanceType to known GPU InstanceTypes
  // P-series: NVIDIA GPU instances (P2, P3, P4, P5 with H100/H200 GPUs)
  // G-series: NVIDIA GPU instances for graphics and ML inference
  // INF-series: AWS Inferentia chips for ML inference
  // TRN-series: AWS Trainium chips for ML training and inference
  // See: https://aws.amazon.com/ec2/instance-types/p5/
  // See: https://aws.amazon.com/ec2/instance-types/trn2/
  const knownGpuInstanceTypes = [InstanceClass.P2, InstanceClass.P3, InstanceClass.P3DN, InstanceClass.P4DE, InstanceClass.P4D,
    InstanceClass.P5, InstanceClass.P5E, InstanceClass.P5EN,
    InstanceClass.G3S, InstanceClass.G3, InstanceClass.G4DN, InstanceClass.G4AD, InstanceClass.G5, InstanceClass.G5G, InstanceClass.G6,
    InstanceClass.G6E, InstanceClass.INF1, InstanceClass.INF2, InstanceClass.TRN1, InstanceClass.TRN1N, InstanceClass.TRN2];
  return knownGpuInstanceTypes.some((c) => instanceType.sameInstanceClassAs(InstanceType.of(c, InstanceSize.LARGE)));
}

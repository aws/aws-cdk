import ec2 = require('@aws-cdk/aws-ec2');

/**
 * Used internally to bootstrap the worker nodes
 * This sets the max pods based on the instanceType created
 * ref: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI
 */
const MAX_PODS = Object.freeze(
  new Map([
    ['c4.large', 29],
    ['c4.xlarge', 58],
    ['c4.2xlarge', 58],
    ['c4.4xlarge', 234],
    ['c4.8xlarge', 234],
    ['c5.large', 29],
    ['c5.xlarge', 58],
    ['c5.2xlarge', 58],
    ['c5.4xlarge', 234],
    ['c5.9xlarge', 234],
    ['c5.18xlarge', 737],
    ['i3.large', 29],
    ['i3.xlarge', 58],
    ['i3.2xlarge', 58],
    ['i3.4xlarge', 234],
    ['i3.8xlarge', 234],
    ['i3.16xlarge', 737],
    ['m3.medium', 12],
    ['m3.large', 29],
    ['m3.xlarge', 58],
    ['m3.2xlarge', 118],
    ['m4.large', 20],
    ['m4.xlarge', 58],
    ['m4.2xlarge', 58],
    ['m4.4xlarge', 234],
    ['m4.10xlarge', 234],
    ['m5.large', 29],
    ['m5.xlarge', 58],
    ['m5.2xlarge', 58],
    ['m5.4xlarge', 234],
    ['m5.12xlarge', 234],
    ['m5.24xlarge', 737],
    ['p2.xlarge', 58],
    ['p2.8xlarge', 234],
    ['p2.16xlarge', 234],
    ['p3.2xlarge', 58],
    ['p3.8xlarge', 234],
    ['p3.16xlarge', 234],
    ['r3.xlarge', 58],
    ['r3.2xlarge', 58],
    ['r3.4xlarge', 234],
    ['r3.8xlarge', 234],
    ['r4.large', 29],
    ['r4.xlarge', 58],
    ['r4.2xlarge', 58],
    ['r4.4xlarge', 234],
    ['r4.8xlarge', 234],
    ['r4.16xlarge', 735],
    ['t2.small', 8],
    ['t2.medium', 17],
    ['t2.large', 35],
    ['t2.xlarge', 44],
    ['t2.2xlarge', 44],
    ['x1.16xlarge', 234],
    ['x1.32xlarge', 234],
  ]),
);

export function maxPodsForInstanceType(instanceType: ec2.InstanceType) {
  const num = MAX_PODS.get(instanceType.toString());
  if (num === undefined) {
    throw new Error(`Instance type not supported for EKS: ${instanceType.toString()}. Please pick a different instance type.`);
  }
  return num;
}
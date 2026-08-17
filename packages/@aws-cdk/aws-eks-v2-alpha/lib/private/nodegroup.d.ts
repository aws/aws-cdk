import { InstanceType } from 'aws-cdk-lib/aws-ec2';
/**
 * This function check if the instanceType is GPU instance.
 * @param instanceType The EC2 instance type
 */
export declare function isGpuInstanceType(instanceType: InstanceType): boolean;

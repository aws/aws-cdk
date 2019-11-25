import ec2 = require('@aws-cdk/aws-ec2');
import { IResource } from '@aws-cdk/core';

export interface IPhysicalRequirements extends IResource {
  /**
   * @attribute
   */
  readonly availabilityZone?: string;

  /**
   * @attribute
   */
  readonly securityGroupIds?: ec2.ISecurityGroup[];

  /**
   * @attribute
   */
  readonly subnet?: ec2.ISubnet;
}

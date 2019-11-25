import ec2 = require('@aws-cdk/aws-ec2');
import { Construct, Fn, IResource, Resource } from '@aws-cdk/core';
import { CfnPhysicalRequirements } from './glue.generated';

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


export interface PhysicalRequirementsAttributes {
  readonly availabilityZone?: string;
  readonly securityGroupIds?: ec2.ISecurityGroup[];
  readonly subnet?: ec2.ISubnet;
}

export interface PhysicalRequirementsProps {
  readonly availabilityZone?: string;
  readonly securityGroupIds?: ec2.ISecurityGroup[];
  readonly subnet?: ec2.ISubnet;
}

export class PhysicalRequirements extends Resource implements IPhysicalRequirements {

  /**
   * The connection's Availability Zone. This field is redundant because the specified subnet
   * implies the Availability Zone to be used. Currently the field must be populated, but it
   * will be deprecated in the future.
   */
  public readonly availabilityZone?: string;

  /**
   * The security group ID list used by the connection.
   */
  public readonly securityGroupIds?: ec2.ISecurityGroup[];

  /**
   * The security group ID list used by the connection.
   */
  public readonly subnet?: ec2.ISubnet;

  constructor(scope: Construct, id: string, props: PhysicalRequirementsProps) {
    super(scope, id, {
      physicalName: '',
    });

    this.availabilityZone = props.availabilityZone;
    this.securityGroupIds = props.securityGroupIds || [];
    this.subnet = props.subnet;

    const physicalRequirementResource = new CfnPhysicalRequirements(this, 'Job', {
      availabilityZone: this.availabilityZone,
      securityGroupIdList:  this.securityGroupIds.map(i => i.securityGroupId),
      subnet: this.subnet.subnetId
    })

    this.node.defaultChild = physicalRequirementResource
  }
}
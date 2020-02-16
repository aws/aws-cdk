import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CfnEnvironmentEC2 } from '../lib/cloud9.generated';

/**
 * A Cloud9 Environment
 */
export interface IEnvironmentEC2 extends cdk.IResource {
  /**
   * The name of the EnvironmentEc2
   * @attribute
   */
  readonly environmentEc2Name: string;

  /**
   * The arn of the EnvironmentEc2
   * @attribute
   */
  readonly environmentEc2Arn: string;

}

/**
 * Properties for EnvironmentEc2
 */
export interface EnvironmentEC2Props {
  /**
   * The type of instance to connect to the environment.
   *
   * @default - t2.micro
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The ID of the subnet in Amazon Virtual Private Cloud (Amazon VPC) that AWS Cloud9 will use to communicate with
   * the Amazon Elastic Compute Cloud (Amazon EC2) instance. If you specify both `subnetId` and `vpc` properties,
   * the `vpc` property will be ignored.
   *
   * @default - the first public subnet of the default VPC
   */
  readonly subnetId?: string;

  /**
   * The AWS VPC that AWS Cloud9 will use to communicate with the Amazon Elastic Compute Cloud (Amazon EC2) instance.
   * The first public subnet of the provided VPC will be selected. However, if you specify `subnetId` as well,
   * the `vpc` property will be ignored.
   *
   * @default - first public subnet of the VPC provided
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Name of the environment
   *
   * @default none
   */
  readonly environmentEc2Name?: string;

  /**
   * Description of the environment
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * A Cloud9 Environment with Amazon EC2
 */
export class EnvironmentEC2 extends cdk.Resource implements IEnvironmentEC2 {
  /**
   * import from EnvironmentEC2Name
   */
  public static fromEnvironmentEC2Name(scope: cdk.Construct, id: string, environmentEC2Name: string): IEnvironmentEC2 {
    class Import extends cdk.Resource {
      public environmentEc2Name = environmentEC2Name;
      public environmentEc2Arn = cdk.Stack.of(this).formatArn({
        service: 'cloud9',
        resource: 'cloud9:*:environmentEc2Name',
        resourceName: this.environmentEc2Name
      });
    }
    return new Import(scope, id);
  }

  /**
   * The environment name of this Cloud9 environment
   */
  public readonly environmentEc2Name: string;

  /**
   * The environment ARN of this Cloud9 environment
   */
  public readonly environmentEc2Arn: string;

  /**
   * The logical ID of this Cloud9 environment in cloudformation
   */
  public readonly logicalId: string;

  /**
   * The environment ID of this Cloud9 environment
   */
  public readonly environmentId: string;

  /**
   * The complete IDE URL of this Cloud9 environment
   */
  public readonly ideUrl: string;

  constructor(scope: cdk.Construct, id: string, props: EnvironmentEC2Props = {}) {
    super(scope, id, {
      physicalName: props.environmentEc2Name
    });
    const c9env = new CfnEnvironmentEC2(this, 'Resource', {
      name: props.environmentEc2Name ?? this.physicalName,
      description: props.description,
      instanceType: props.instanceType ? props.instanceType.toString() :
        ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO).toString(),
      subnetId: props.subnetId ?? props.vpc ? props.vpc!.publicSubnets[0].subnetId.toString() :
        new ec2.Vpc(this, 'Vpc', { maxAzs: 2 }).publicSubnets[0].subnetId.toString(),
    });

    this.logicalId = c9env.logicalId;
    this.environmentId = cdk.Fn.ref(this.logicalId);
    this.environmentEc2Arn = c9env.getAtt('Arn').toString();
    this.environmentEc2Name = c9env.getAtt('Name').toString();
    this.ideUrl = `https://${this.stack.region}.console.aws.amazon.com/cloud9/ide/${this.environmentId}`;
  }
}
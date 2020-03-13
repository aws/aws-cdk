import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CfnEnvironmentEC2 } from '../lib/cloud9.generated';

/**
 * A Cloud9 Environment
 *
 */
export interface IEnvironmentEc2 extends cdk.IResource {
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
export interface EnvironmentEc2Props {
  /**
   * The type of instance to connect to the environment.
   *
   * @default - t2.micro
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The subnetSelection of the VPC that AWS Cloud9 will use to communicate with
   * the Amazon EC2 instance.
   *
   * @default - all public subnets of the VPC are selected.
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The VPC that AWS Cloud9 will use to communicate with the Amazon Elastic Compute Cloud (Amazon EC2) instance.
   *
   */
  readonly vpc: ec2.IVpc;

  /**
   * Name of the environment
   *
   * @default - automatically generated name
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
 * @resource AWS::Cloud9::EnvironmentEC2
 */
export class EnvironmentEc2 extends cdk.Resource implements IEnvironmentEc2 {
  /**
   * import from EnvironmentEc2Name
   */
  public static fromEnvironmentEc2Name(scope: cdk.Construct, id: string, environmentEc2Name: string): IEnvironmentEc2 {
    class Import extends cdk.Resource {
      public environmentEc2Name = environmentEc2Name;
      public environmentEc2Arn = cdk.Stack.of(this).formatArn({
        service: 'cloud9',
        resource: 'environment',
        resourceName: this.environmentEc2Name,
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
   * The environment ID of this Cloud9 environment
   */
  public readonly environmentId: string;

  /**
   * The complete IDE URL of this Cloud9 environment
   */
  public readonly ideUrl: string;

  /**
   * VPC ID
   */
   private readonly vpc: ec2.IVpc;

  constructor(scope: cdk.Construct, id: string, props: EnvironmentEc2Props) {
    super(scope, id);

    this.vpc = props.vpc;
    if (!props.subnetSelection && this.vpc.publicSubnets.length === 0) {
      throw new Error('no subnetSelection specified and no public subnet found in the vpc, please specify subnetSelection');
    }
    const c9env = new CfnEnvironmentEC2(this, 'Resource', {
      name: props.environmentEc2Name,
      description: props.description,
      instanceType: props.instanceType?.toString() ?? ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO).toString(),
      // subnetId: props.vpc.selectSubnets(props.subnetSelection).subnetIds[0],
      subnetId: props.subnetSelection ? this.vpc.selectSubnets(props.subnetSelection).subnetIds[0] :
        this.vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }).subnetIds[0] ,
    });
    this.environmentId = c9env.ref;
    this.environmentEc2Arn = c9env.getAtt('Arn').toString();
    this.environmentEc2Name = c9env.getAtt('Name').toString();
    this.ideUrl = `https://${this.stack.region}.console.aws.amazon.com/cloud9/ide/${this.environmentId}`;
    // new cdk.CfnOutput(this, 'ARN', { value: c9env.attrArn});
  }
}
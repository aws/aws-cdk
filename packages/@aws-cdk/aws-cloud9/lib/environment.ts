import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CfnEnvironmentEC2 } from '../lib/cloud9.generated';

/**
 * A Cloud9 Environment
 *
 */
export interface IEc2Environment extends cdk.IResource {
  /**
   * The name of the EnvironmentEc2
   *
   * @attribute environmentEc2Name
   */
  readonly ec2EnvironmentName: string;

  /**
   * The arn of the EnvironmentEc2
   *
   * @attribute environmentE2Arn
   */
  readonly ec2EnvironmentArn: string;

}

/**
 * Properties for Ec2Environment
 */
export interface Ec2EnvironmentProps {
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
  readonly ec2EnvironmentName?: string;

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
export class Ec2Environment extends cdk.Resource implements IEc2Environment {
  /**
   * import from EnvironmentEc2Name
   */
  public static fromEc2EnvironmentName(scope: cdk.Construct, id: string, ec2EnvironmentName: string): IEc2Environment {
    class Import extends cdk.Resource {
      public ec2EnvironmentName = ec2EnvironmentName;
      public ec2EnvironmentArn = cdk.Stack.of(this).formatArn({
        service: 'cloud9',
        resource: 'environment',
        resourceName: this.ec2EnvironmentName,
      });
    }
    return new Import(scope, id);
  }

  /**
   * The environment name of this Cloud9 environment
   *
   * @attribute
   */
  public readonly ec2EnvironmentName: string;

  /**
   * The environment ARN of this Cloud9 environment
   *
   * @attribute
   */
  public readonly ec2EnvironmentArn: string;

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
   public readonly vpc: ec2.IVpc;

  constructor(scope: cdk.Construct, id: string, props: Ec2EnvironmentProps) {
    super(scope, id);

    this.vpc = props.vpc;
    if (!props.subnetSelection && this.vpc.publicSubnets.length === 0) {
      throw new Error('no subnetSelection specified and no public subnet found in the vpc, please specify subnetSelection');
    }

    const vpcSubnets = props.subnetSelection ?? { subnetType: ec2.SubnetType.PUBLIC };
    const c9env = new CfnEnvironmentEC2(this, 'Resource', {
      name: props.ec2EnvironmentName,
      description: props.description,
      instanceType: props.instanceType?.toString() ?? ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO).toString(),
      subnetId: this.vpc.selectSubnets(vpcSubnets).subnetIds[0] ,
    });
    this.environmentId = c9env.ref;
    this.ec2EnvironmentArn = c9env.getAtt('Arn').toString();
    this.ec2EnvironmentName = c9env.getAtt('Name').toString();
    this.ideUrl = `https://${this.stack.region}.console.aws.amazon.com/cloud9/ide/${this.environmentId}`;
  }
}
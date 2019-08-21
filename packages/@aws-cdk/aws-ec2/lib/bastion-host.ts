import { PolicyStatement } from "@aws-cdk/aws-iam";
import { CfnOutput, Construct } from "@aws-cdk/core";
import { AmazonLinuxGeneration, AmazonLinuxImage, InstanceClass, InstanceSize, InstanceType } from ".";
import { Instance } from "./instance";
import { ISecurityGroup } from "./security-group";
import { IVpc, SubnetType } from "./vpc";

/**
 * Properties of the bastion host
 *
 * @experimental
 */
export interface BastionHostLinuxProps {

  /**
   * In which AZ to place the instance within the VPC
   *
   * @default - Random zone.
   */
  readonly availabilityZone?: string;

  /**
   * VPC to launch the instance in.
   */
  readonly vpc: IVpc;

  /**
   * The name of the instance
   *
   * @default 'BastionHost'
   */
  readonly instanceName?: string;

  /**
   * Use a public subnet instead of a private one.
   * Set this to 'true' if you need to connect to this instance via the internet and cannot use SSM.
   * You have to allow port 22 manually by using the connections field
   *
   * @default - false
   */
  readonly publicSubnets?: boolean;

  /**
   * Security Group to assign to this instance
   *
   * @default - create new security group with no inbound and all outbound traffic allowed
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * Type of instance to launch
   * @default 't3.nano'
   */
  readonly instanceType?: InstanceType;

}

/**
 * This creates a linux bastion host you can use to connect to other instances or services in your VPC.
 * The recommended way to connect to the bastion host is by using AWS Systems Manager Session Manager.
 *
 * The operating system is Amazon Linux 2 with the latest SSM agent installed
 *
 * You can also configure this bastion host to allow connections via SSH
 *
 * @experimental
 */
export class BastionHostLinux extends Instance {
  constructor(scope: Construct, id: string, props: BastionHostLinuxProps) {
    super(scope, id, {
      vpc: props.vpc,
      availabilityZone: props.availabilityZone,
      securityGroup: props.securityGroup,
      instanceName: props.instanceName || 'BastionHost',
      instanceType: props.instanceType || InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
      machineImage: new AmazonLinuxImage({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      vpcSubnets: props.publicSubnets ? { subnetType: SubnetType.PUBLIC } : { subnetType: SubnetType.PRIVATE },
    });
    this.addToRolePolicy(new PolicyStatement({
      actions: [
        'ssmmessages:*',
        'ssm:UpdateInstanceInformation',
        'ec2messages:*'
      ],
      resources: ['*'],
    }));
    this.addUserData('yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm');

    new CfnOutput(this, 'BastionHostId', {
      description: 'Instance ID of the bastion host. Use this to connect via SSM Session Manager',
      value: this.instanceId,
    });
  }
}
import { IPrincipal, IRole, PolicyStatement } from '@aws-cdk/aws-iam';
import { CfnOutput, Construct, Stack } from '@aws-cdk/core';
import { AmazonLinuxGeneration, InstanceClass, InstanceSize, InstanceType } from '.';
import { Connections } from './connections';
import { IInstance, Instance } from './instance';
import { IMachineImage, MachineImage } from './machine-image';
import { IPeer } from './peer';
import { Port } from './port';
import { ISecurityGroup } from './security-group';
import { IVpc, SubnetSelection } from './vpc';

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
   * Select the subnets to run the bastion host in.
   * Set this to PUBLIC if you need to connect to this instance via the internet and cannot use SSM.
   * You have to allow port 22 manually by using the connections field
   *
   * @default - private subnets of the supplied VPC
   */
  readonly subnetSelection?: SubnetSelection;

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

  /**
   * The machine image to use
   *
   * @default - An Amazon Linux 2 image which is kept up-to-date automatically (the instance
   * may be replaced on every deployment).
   */
  readonly machineImage?: IMachineImage;
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
export class BastionHostLinux extends Construct implements IInstance {
  public readonly stack: Stack;

  /**
   * Allows specify security group connections for the instance.
   */
  public readonly connections: Connections;

  /**
   * The IAM role assumed by the instance.
   */
  public readonly role: IRole;

  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: IPrincipal;

  /**
   * The underlying instance resource
   */
  public readonly instance: Instance;

  /**
   * @attribute
   */
  public readonly instanceId: string;

  /**
   * @attribute
   */
  public readonly instanceAvailabilityZone: string;

  /**
   * @attribute
   */
  public readonly instancePrivateDnsName: string;
  /**
   * @attribute
   */
  public readonly instancePrivateIp: string;
  /**
   * @attribute
   */
  public readonly instancePublicDnsName: string;
  /**
   * @attribute
   */
  public readonly instancePublicIp: string;

  constructor(scope: Construct, id: string, props: BastionHostLinuxProps) {
    super(scope, id);
    this.stack = Stack.of(scope);
    this.instance = new Instance(this, 'Resource', {
      vpc: props.vpc,
      availabilityZone: props.availabilityZone,
      securityGroup: props.securityGroup,
      instanceName: props.instanceName ?? 'BastionHost',
      instanceType: props.instanceType ?? InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
      machineImage: props.machineImage ?? MachineImage.latestAmazonLinux({ generation: AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      vpcSubnets: props.subnetSelection ?? {},
    });
    this.instance.addToRolePolicy(new PolicyStatement({
      actions: [
        'ssmmessages:*',
        'ssm:UpdateInstanceInformation',
        'ec2messages:*',
      ],
      resources: ['*'],
    }));
    this.instance.addUserData('yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm');

    this.connections = this.instance.connections;
    this.role = this.instance.role;
    this.grantPrincipal = this.instance.role;
    this.instanceId = this.instance.instanceId;
    this.instancePrivateIp = this.instance.instancePrivateIp;
    this.instanceAvailabilityZone = this.instance.instanceAvailabilityZone;
    this.instancePrivateDnsName = this.instance.instancePrivateDnsName;
    this.instancePublicIp = this.instance.instancePublicIp;
    this.instancePublicDnsName = this.instance.instancePublicDnsName;

    new CfnOutput(this, 'BastionHostId', {
      description: 'Instance ID of the bastion host. Use this to connect via SSM Session Manager',
      value: this.instanceId,
    });
  }

  /**
   * Allow SSH access from the given peer or peers
   *
   * Necessary if you want to connect to the instance using ssh. If not
   * called, you should use SSM Session Manager to connect to the instance.
   */
  public allowSshAccessFrom(...peer: IPeer[]): void {
    peer.forEach(p => {
      this.connections.allowFrom(p, Port.tcp(22), 'SSH access');
    });
  }
}
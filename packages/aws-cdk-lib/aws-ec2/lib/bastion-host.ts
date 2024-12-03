import { Construct } from 'constructs';
import { InstanceArchitecture, InstanceClass, InstanceSize, InstanceType } from '.';
import { CloudFormationInit } from './cfn-init';
import { Connections } from './connections';
import { ApplyCloudFormationInitOptions, IInstance, Instance } from './instance';
import { AmazonLinuxCpuType, IMachineImage, MachineImage } from './machine-image';
import { IPeer } from './peer';
import { Port } from './port';
import { ISecurityGroup } from './security-group';
import { BlockDevice } from './volume';
import { IVpc, SubnetSelection } from './vpc';
import { IPrincipal, IRole, PolicyStatement } from '../../aws-iam';
import { CfnOutput, FeatureFlags, Resource, Stack } from '../../core';
import { BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT } from '../../cx-api';

/**
 * Properties of the bastion host
 *
 *
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
   * The machine image to use, assumed to have SSM Agent preinstalled.
   *
   * @default - An Amazon Linux 2023 image if the `@aws-cdk/aws-ec2:bastionHostUseAmazonLinux2023ByDefault` feature flag is enabled. Otherwise, an Amazon Linux 2 image. In both cases, the image is kept up-to-date automatically (the instance
   * may be replaced on every deployment) and already has SSM Agent installed.
   */
  readonly machineImage?: IMachineImage;

  /**
   * Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.
   *
   * Each instance that is launched has an associated root device volume,
   * either an Amazon EBS volume or an instance store volume.
   * You can use block device mappings to specify additional EBS volumes or
   * instance store volumes to attach to an instance when it is launched.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html
   *
   * @default - Uses the block device mapping of the AMI
   */
  readonly blockDevices?: BlockDevice[];

  /**
   * Apply the given CloudFormation Init configuration to the instance at startup
   *
   * @default - no CloudFormation init
   */
  readonly init?: CloudFormationInit;

  /**
   * Use the given options for applying CloudFormation Init
   *
   * Describes the configsets to use and the timeout to wait
   *
   * @default - default options
   */
  readonly initOptions?: ApplyCloudFormationInitOptions;

  /**
   * Whether IMDSv2 should be required on this instance
   *
   * @default - false
   */
  readonly requireImdsv2?: boolean;

  /**
  * Determines whether changes to the UserData will force instance replacement.
  *
  * Depending on the EC2 instance type, modifying the UserData may either restart
  * or replace the instance:
  *
  * - Instance store-backed instances are replaced.
  * - EBS-backed instances are restarted.
  *
  * Note that by default, restarting does not execute the updated UserData, so an alternative
  * mechanism is needed to ensure the instance re-executes the UserData.
  *
  * When set to `true`, the instance's Logical ID will depend on the UserData, causing
  * CloudFormation to replace the instance if the UserData changes.
  *
  * @default - `true` if `initOptions` is specified, otherwise `false`.
  */
  readonly userDataCausesReplacement?: boolean;
}

/**
 * This creates a linux bastion host you can use to connect to other instances or services in your VPC.
 * The recommended way to connect to the bastion host is by using AWS Systems Manager Session Manager.
 *
 * The operating system is Amazon Linux 2 with the latest SSM agent installed
 *
 * You can also configure this bastion host to allow connections via SSH
 *
 *
 * @resource AWS::EC2::Instance
 */
export class BastionHostLinux extends Resource implements IInstance {
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
    const instanceType = props.instanceType ?? InstanceType.of(InstanceClass.T3, InstanceSize.NANO);
    this.instance = new Instance(this, 'Resource', {
      vpc: props.vpc,
      availabilityZone: props.availabilityZone,
      securityGroup: props.securityGroup,
      instanceName: props.instanceName ?? 'BastionHost',
      instanceType,
      machineImage: this.getMachineImage(this, instanceType, props),
      vpcSubnets: props.subnetSelection ?? {},
      blockDevices: props.blockDevices ?? undefined,
      init: props.init,
      initOptions: props.initOptions,
      requireImdsv2: props.requireImdsv2 ?? false,
      userDataCausesReplacement: props.userDataCausesReplacement,
    });
    this.instance.addToRolePolicy(new PolicyStatement({
      actions: [
        'ssmmessages:*',
        'ssm:UpdateInstanceInformation',
        'ec2messages:*',
      ],
      resources: ['*'],
    }));
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
   * Returns the AmazonLinuxCpuType corresponding to the given instance architecture
   * @param architecture the instance architecture value to convert
   */
  private toAmazonLinuxCpuType(architecture: InstanceArchitecture): AmazonLinuxCpuType {
    if (architecture === InstanceArchitecture.ARM_64) {
      return AmazonLinuxCpuType.ARM_64;
    } else if (architecture === InstanceArchitecture.X86_64) {
      return AmazonLinuxCpuType.X86_64;
    }

    throw new Error(`Unsupported instance architecture '${architecture}'`);
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

  /**
   * Returns the machine image to use for the bastion host, respecting the feature flag
   * to default to Amazon Linux 2023 if enabled, otherwise defaulting to Amazon Linux 2.
   */
  private getMachineImage(scope: Construct, instanceType: InstanceType, props: BastionHostLinuxProps): IMachineImage {
    const defaultMachineImage = FeatureFlags.of(scope).isEnabled(BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT)
      ? MachineImage.latestAmazonLinux2023({
        cpuType: this.toAmazonLinuxCpuType(instanceType.architecture),
      })
      : MachineImage.latestAmazonLinux2({
        cpuType: this.toAmazonLinuxCpuType(instanceType.architecture),
      });
    return props.machineImage ?? defaultMachineImage;
  }
}

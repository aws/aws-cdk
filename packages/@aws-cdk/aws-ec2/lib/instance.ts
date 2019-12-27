import * as iam from '@aws-cdk/aws-iam';

import { Construct, Duration, Fn, IResource, Lazy, Resource, Tag } from '@aws-cdk/core';
import { Connections, IConnectable } from './connections';
import { CfnInstance } from './ec2.generated';
import { InstanceType } from './instance-types';
import { IMachineImage, OperatingSystemType } from './machine-image';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { UserData } from './user-data';
import { BlockDevice, synthesizeBlockDeviceMappings } from './volume';
import { IVpc, SubnetSelection } from './vpc';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

export interface IInstance extends IResource, IConnectable, iam.IGrantable {
  /**
   * The instance's ID
   *
   * @attribute
   */
  readonly instanceId: string;

  /**
   * The availability zone the instance was launched in
   *
   * @attribute
   */
  readonly instanceAvailabilityZone: string;

  /**
   * Private DNS name for this instance
   * @attribute
   */
  readonly instancePrivateDnsName: string;

  /**
   * Private IP for this instance
   *
   * @attribute
   */
  readonly instancePrivateIp: string;

  /**
   * Publicly-routable DNS name for this instance.
   *
   * (May be an empty string if the instance does not have a public name).
   *
   * @attribute
   */
  readonly instancePublicDnsName: string;

  /**
   * Publicly-routable IP  address for this instance.
   *
   * (May be an empty string if the instance does not have a public IP).
   *
   * @attribute
   */
  readonly instancePublicIp: string;
}

/**
 * Properties of an EC2 Instance
 */
export interface InstanceProps {

  /**
   * Name of SSH keypair to grant access to instance
   *
   * @default - No SSH access will be possible.
   */
  readonly keyName?: string;

  /**
   * Where to place the instance within the VPC
   *
   * @default - Private subnets.
   */
  readonly vpcSubnets?: SubnetSelection;

  /**
   * In which AZ to place the instance within the VPC
   *
   * @default - Random zone.
   */
  readonly availabilityZone?: string;

  /**
   * Whether the instance could initiate connections to anywhere by default.
   * This property is only used when you do not provide a security group.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;

  /**
   * The length of time to wait for the resourceSignalCount
   *
   * The maximum value is 43200 (12 hours).
   *
   * @default Duration.minutes(5)
   */
  readonly resourceSignalTimeout?: Duration;

  /**
   * VPC to launch the instance in.
   */
  readonly vpc: IVpc;

  /**
   * Security Group to assign to this instance
   *
   * @default - create new security group
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * Type of instance to launch
   */
  readonly instanceType: InstanceType;

  /**
   * AMI to launch
   */
  readonly machineImage: IMachineImage;

  /**
   * Specific UserData to use
   *
   * The UserData may still be mutated after creation.
   *
   * @default - A UserData object appropriate for the MachineImage's
   * Operating System is created.
   */
  readonly userData?: UserData;

  /**
   * An IAM role to associate with the instance profile assigned to this Auto Scaling Group.
   *
   * The role must be assumable by the service principal `ec2.amazonaws.com`:
   *
   * @example
   *
   *    const role = new iam.Role(this, 'MyRole', {
   *      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
   *    });
   *
   * @default - A role will automatically be created, it can be accessed via the `role` property
   */
  readonly role?: iam.IRole;

  /**
   * The name of the instance
   *
   * @default - CDK generated name
   */
  readonly instanceName?: string;

  /**
   * Specifies whether to enable an instance launched in a VPC to perform NAT.
   * This controls whether source/destination checking is enabled on the instance.
   * A value of true means that checking is enabled, and false means that checking is disabled.
   * The value must be false for the instance to perform NAT.
   *
   * @default true
   */
  readonly sourceDestCheck?: boolean;

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
   * Defines a private IP address to associate with an instance.
   *
   * Private IP should be available within the VPC that the instance is build within.
   *
   * @default - no association
   */
  readonly privateIpAddress?: string
}

/**
 * This represents a single EC2 instance
 */
export class Instance extends Resource implements IInstance {

  /**
   * The type of OS the instance is running.
   */
  public readonly osType: OperatingSystemType;

  /**
   * Allows specify security group connections for the instance.
   */
  public readonly connections: Connections;

  /**
   * The IAM role assumed by the instance.
   */
  public readonly role: iam.IRole;

  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * UserData for the instance
   */
  public readonly userData: UserData;

  /**
   * the underlying instance resource
   */
  public readonly instance: CfnInstance;
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

  private readonly securityGroup: ISecurityGroup;
  private readonly securityGroups: ISecurityGroup[] = [];

  constructor(scope: Construct, id: string, props: InstanceProps) {
    super(scope, id);

    if (props.securityGroup) {
      this.securityGroup = props.securityGroup;
    } else {
      this.securityGroup = new SecurityGroup(this, 'InstanceSecurityGroup', {
        vpc: props.vpc,
        allowAllOutbound: props.allowAllOutbound !== false
      });
    }
    this.connections = new Connections({ securityGroups: [this.securityGroup] });
    this.securityGroups.push(this.securityGroup);
    Tag.add(this, NAME_TAG, props.instanceName || this.node.path);

    this.role = props.role || new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });
    this.grantPrincipal = this.role;

    const iamProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [this.role.roleName]
    });

    // use delayed evaluation
    const imageConfig = props.machineImage.getImage(this);
    this.userData = props.userData || imageConfig.userData || UserData.forOperatingSystem(imageConfig.osType);
    const userDataToken = Lazy.stringValue({ produce: () => Fn.base64(this.userData.render()) });
    const securityGroupsToken = Lazy.listValue({ produce: () => this.securityGroups.map(sg => sg.securityGroupId) });

    const { subnets } = props.vpc.selectSubnets(props.vpcSubnets);
    let subnet;
    if (props.availabilityZone) {
      const selected = subnets.filter(sn => sn.availabilityZone === props.availabilityZone);
      if (selected.length === 1) {
        subnet = selected[0];
      } else {
        throw new Error('When specifying AZ there has to be exactly on subnet of the given type in this az');
      }
    } else {
      subnet = subnets[0];
    }

    this.instance = new CfnInstance(this, 'Resource', {
      imageId: imageConfig.imageId,
      keyName: props.keyName,
      instanceType: props.instanceType.toString(),
      securityGroupIds: securityGroupsToken,
      iamInstanceProfile: iamProfile.ref,
      userData: userDataToken,
      subnetId: subnet.subnetId,
      availabilityZone: subnet.availabilityZone,
      sourceDestCheck: props.sourceDestCheck,
      blockDeviceMappings: props.blockDevices !== undefined ? synthesizeBlockDeviceMappings(this, props.blockDevices) : undefined,
      privateIpAddress: props.privateIpAddress
    });
    this.instance.node.addDependency(this.role);

    this.osType = imageConfig.osType;
    this.node.defaultChild = this.instance;

    this.instanceId = this.instance.ref;
    this.instanceAvailabilityZone = this.instance.attrAvailabilityZone;
    this.instancePrivateDnsName = this.instance.attrPrivateDnsName;
    this.instancePrivateIp = this.instance.attrPrivateIp;
    this.instancePublicDnsName = this.instance.attrPublicDnsName;
    this.instancePublicIp = this.instance.attrPublicIp;

    this.applyUpdatePolicies(props);
  }

  /**
   * Add the security group to the instance.
   *
   * @param securityGroup: The security group to add
   */
  public addSecurityGroup(securityGroup: ISecurityGroup): void {
    this.securityGroups.push(securityGroup);
  }

  /**
   * Add command to the startup script of the instance.
   * The command must be in the scripting language supported by the instance's OS (i.e. Linux/Windows).
   */
  public addUserData(...commands: string[]) {
    this.userData.addCommands(...commands);
  }

  /**
   * Adds a statement to the IAM role assumed by the instance.
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.role.addToPolicy(statement);
  }

  /**
   * Apply CloudFormation update policies for the instance
   */
  private applyUpdatePolicies(props: InstanceProps) {
    if (props.resourceSignalTimeout !== undefined) {
      this.instance.cfnOptions.creationPolicy = {
        ...this.instance.cfnOptions.creationPolicy,
        resourceSignal: {
          timeout: props.resourceSignalTimeout && props.resourceSignalTimeout.toISOString(),
        }
      };
    }
  }
}

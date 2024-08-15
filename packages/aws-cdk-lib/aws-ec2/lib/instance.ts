
import { Construct } from 'constructs';
import { InstanceRequireImdsv2Aspect } from './aspects';
import { CloudFormationInit } from './cfn-init';
import { Connections, IConnectable } from './connections';
import { CfnInstance } from './ec2.generated';
import { InstanceType } from './instance-types';
import { IKeyPair } from './key-pair';
import { CpuCredits, InstanceInitiatedShutdownBehavior } from './launch-template';
import { IMachineImage, OperatingSystemType } from './machine-image';
import { IPlacementGroup } from './placement-group';
import { instanceBlockDeviceMappings } from './private/ebs-util';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { UserData } from './user-data';
import { BlockDevice } from './volume';
import { IVpc, Subnet, SubnetSelection } from './vpc';
import * as iam from '../../aws-iam';
import { Annotations, Aspects, Duration, Fn, IResource, Lazy, Resource, Stack, Tags, Token } from '../../core';
import { md5hash } from '../../core/lib/helpers-internal';

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
   * @deprecated - Use `keyPair` instead - https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html#using-an-existing-ec2-key-pair
   */
  readonly keyName?: string;

  /**
   * The SSH keypair to grant access to the instance.
   *
   * @default - No SSH access will be possible.
   */
  readonly keyPair?: IKeyPair;

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
   * Whether the instance could initiate IPv6 connections to anywhere by default.
   * This property is only used when you do not provide a security group.
   *
   * @default false
   */
  readonly allowAllIpv6Outbound?: boolean;

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
   * Changes to the UserData force replacement
   *
   * Depending the EC2 instance type, changing UserData either
   * restarts the instance or replaces the instance.
   *
   * - Instance store-backed instances are replaced.
   * - EBS-backed instances are restarted.
   *
   * By default, restarting does not execute the new UserData so you
   * will need a different mechanism to ensure the instance is restarted.
   *
   * Setting this to `true` will make the instance's Logical ID depend on the
   * UserData, which will cause CloudFormation to replace it if the UserData
   * changes.
   *
   * @default - true iff `initOptions` is specified, false otherwise.
   */
  readonly userDataCausesReplacement?: boolean;

  /**
   * An IAM role to associate with the instance profile assigned to this Auto Scaling Group.
   *
   * The role must be assumable by the service principal `ec2.amazonaws.com`:
   *
   * @example
   * const role = new iam.Role(this, 'MyRole', {
   *   assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
   * });
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
  readonly privateIpAddress?: string;

  /**
   * Propagate the EC2 instance tags to the EBS volumes.
   *
   * @default - false
   */
  readonly propagateTagsToVolumeOnCreation?: boolean;

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
   * Whether IMDSv2 should be required on this instance.
   *
   * @default - false
   */
  readonly requireImdsv2?: boolean;

  /**
   * Whether "Detailed Monitoring" is enabled for this instance
   * Keep in mind that Detailed Monitoring results in extra charges
   *
   * @see http://aws.amazon.com/cloudwatch/pricing/
   * @default - false
   */
  readonly detailedMonitoring?: boolean;

  /**
   * Add SSM session permissions to the instance role
   *
   * Setting this to `true` adds the necessary permissions to connect
   * to the instance using SSM Session Manager. You can do this
   * from the AWS Console.
   *
   * NOTE: Setting this flag to `true` may not be enough by itself.
   * You must also use an AMI that comes with the SSM Agent, or install
   * the SSM Agent yourself. See
   * [Working with SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)
   * in the SSM Developer Guide.
   *
   * @default false
   */
  readonly ssmSessionPermissions?: boolean;

  /**
   * Whether to associate a public IP address to the primary network interface attached to this instance.
   *
   * You cannot specify this property and `ipv6AddressCount` at the same time.
   *
   * @default - public IP address is automatically assigned based on default behavior
   */
  readonly associatePublicIpAddress?: boolean;

  /**
   * Specifying the CPU credit type for burstable EC2 instance types (T2, T3, T3a, etc).
   * The unlimited CPU credit option is not supported for T3 instances with a dedicated host.
   *
   * @default - T2 instances are standard, while T3, T4g, and T3a instances are unlimited.
   */
  readonly creditSpecification?: CpuCredits;

  /**
   * Indicates whether the instance is optimized for Amazon EBS I/O.
   *
   * This optimization provides dedicated throughput to Amazon EBS and an optimized configuration stack to provide optimal Amazon EBS I/O performance.
   * This optimization isn't available with all instance types.
   * Additional usage charges apply when using an EBS-optimized instance.
   *
   * @default false
   */
  readonly ebsOptimized?: boolean;

  /**
   * Indicates whether an instance stops or terminates when you initiate shutdown from the instance
   * (using the operating system command for system shutdown).
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#Using_ChangingInstanceInitiatedShutdownBehavior
   *
   * @default InstanceInitiatedShutdownBehavior.STOP
   */
  readonly instanceInitiatedShutdownBehavior?: InstanceInitiatedShutdownBehavior;

  /**
   * The placement group that you want to launch the instance into.
   *
   * @default - no placement group will be used for this instance.
   */
  readonly placementGroup?: IPlacementGroup;

  /**
   * Whether the instance is enabled for AWS Nitro Enclaves.
   *
   * Nitro Enclaves requires a Nitro-based virtualized parent instance with specific Intel/AMD with at least 4 vCPUs
   * or Graviton with at least 2 vCPUs instance types and Linux/Windows host OS,
   * while the enclave itself supports only Linux OS.
   *
   * You can't set both `enclaveEnabled` and `hibernationEnabled` to true on the same instance.
   *
   * @see https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave.html#nitro-enclave-reqs
   *
   * @default - false
   */
  readonly enclaveEnabled?: boolean;

  /**
   * Whether the instance is enabled for hibernation.
   *
   * You can't set both `enclaveEnabled` and `hibernationEnabled` to true on the same instance.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-hibernationoptions.html
   *
   * @default - false
   */
  readonly hibernationEnabled?: boolean;

  /**
   * The number of IPv6 addresses to associate with the primary network interface.
   *
   * Amazon EC2 chooses the IPv6 addresses from the range of your subnet.
   *
   * You cannot specify this property and `associatePublicIpAddress` at the same time.
   *
   * @default - For instances associated with an IPv6 subnet, use 1; otherwise, use 0.
   */
  readonly ipv6AddressCount?: number;
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

    if (props.initOptions && !props.init) {
      throw new Error('Setting \'initOptions\' requires that \'init\' is also set');
    }

    if (props.keyName && props.keyPair) {
      throw new Error('Cannot specify both of \'keyName\' and \'keyPair\'; prefer \'keyPair\'');
    }

    // if credit specification is set, then the instance type must be burstable
    if (props.creditSpecification && !props.instanceType.isBurstable()) {
      throw new Error(`creditSpecification is supported only for T4g, T3a, T3, T2 instance type, got: ${props.instanceType.toString()}`);
    }

    if (props.securityGroup) {
      this.securityGroup = props.securityGroup;
    } else {
      this.securityGroup = new SecurityGroup(this, 'InstanceSecurityGroup', {
        vpc: props.vpc,
        allowAllOutbound: props.allowAllOutbound !== false,
        allowAllIpv6Outbound: props.allowAllIpv6Outbound,
      });
    }
    this.connections = new Connections({ securityGroups: [this.securityGroup] });
    this.securityGroups.push(this.securityGroup);
    Tags.of(this).add(NAME_TAG, props.instanceName || this.node.path);

    this.role = props.role || new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    this.grantPrincipal = this.role;

    if (props.ssmSessionPermissions) {
      this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    }

    const iamProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [this.role.roleName],
    });

    // use delayed evaluation
    const imageConfig = props.machineImage.getImage(this);
    this.userData = props.userData ?? imageConfig.userData;
    const userDataToken = Lazy.string({ produce: () => Fn.base64(this.userData.render()) });
    const securityGroupsToken = Lazy.list({ produce: () => this.securityGroups.map(sg => sg.securityGroupId) });

    const { subnets, hasPublic } = props.vpc.selectSubnets(props.vpcSubnets);
    let subnet;
    if (props.availabilityZone) {
      const selected = subnets.filter(sn => sn.availabilityZone === props.availabilityZone);
      if (selected.length === 1) {
        subnet = selected[0];
      } else {
        Annotations.of(this).addError(`Need exactly 1 subnet to match AZ '${props.availabilityZone}', found ${selected.length}. Use a different availabilityZone.`);
      }
    } else {
      if (subnets.length > 0) {
        subnet = subnets[0];
      } else {
        Annotations.of(this).addError(`Did not find any subnets matching '${JSON.stringify(props.vpcSubnets)}', please use a different selection.`);
      }
    }
    if (!subnet) {
      // We got here and we don't have a subnet because of validation errors.
      // Invent one on the spot so the code below doesn't fail.
      subnet = Subnet.fromSubnetAttributes(this, 'DummySubnet', {
        subnetId: 's-notfound',
        availabilityZone: 'az-notfound',
      });
    }

    // network interfaces array is set to configure the primary network interface if associatePublicIpAddress is true or false
    const networkInterfaces = props.associatePublicIpAddress !== undefined
      ? [{
        deviceIndex: '0',
        associatePublicIpAddress: props.associatePublicIpAddress,
        subnetId: subnet.subnetId,
        groupSet: securityGroupsToken,
        privateIpAddress: props.privateIpAddress,
      }] : undefined;

    if (props.keyPair && !props.keyPair._isOsCompatible(imageConfig.osType)) {
      throw new Error(`${props.keyPair.type} keys are not compatible with the chosen AMI`);
    }

    if (props.enclaveEnabled && props.hibernationEnabled) {
      throw new Error('You can\'t set both `enclaveEnabled` and `hibernationEnabled` to true on the same instance');
    }

    if (
      props.ipv6AddressCount !== undefined &&
      !Token.isUnresolved(props.ipv6AddressCount) &&
      (props.ipv6AddressCount < 0 || !Number.isInteger(props.ipv6AddressCount))
    ) {
      throw new Error(`\'ipv6AddressCount\' must be a non-negative integer, got: ${props.ipv6AddressCount}`);
    }

    if (
      props.ipv6AddressCount !== undefined &&
      props.associatePublicIpAddress !== undefined) {
      throw new Error('You can\'t set both \'ipv6AddressCount\' and \'associatePublicIpAddress\'');
    }

    // if network interfaces array is configured then subnetId, securityGroupIds,
    // and privateIpAddress are configured on the network interface level and
    // there is no need to configure them on the instance level
    this.instance = new CfnInstance(this, 'Resource', {
      imageId: imageConfig.imageId,
      keyName: props.keyPair?.keyPairName ?? props?.keyName,
      instanceType: props.instanceType.toString(),
      subnetId: networkInterfaces ? undefined : subnet.subnetId,
      securityGroupIds: networkInterfaces ? undefined : securityGroupsToken,
      networkInterfaces,
      iamInstanceProfile: iamProfile.ref,
      userData: userDataToken,
      availabilityZone: subnet.availabilityZone,
      sourceDestCheck: props.sourceDestCheck,
      blockDeviceMappings: props.blockDevices !== undefined ? instanceBlockDeviceMappings(this, props.blockDevices) : undefined,
      privateIpAddress: networkInterfaces ? undefined : props.privateIpAddress,
      propagateTagsToVolumeOnCreation: props.propagateTagsToVolumeOnCreation,
      monitoring: props.detailedMonitoring,
      creditSpecification: props.creditSpecification ? { cpuCredits: props.creditSpecification } : undefined,
      ebsOptimized: props.ebsOptimized,
      instanceInitiatedShutdownBehavior: props.instanceInitiatedShutdownBehavior,
      placementGroupName: props.placementGroup?.placementGroupName,
      enclaveOptions: props.enclaveEnabled !== undefined ? { enabled: props.enclaveEnabled } : undefined,
      hibernationOptions: props.hibernationEnabled !== undefined ? { configured: props.hibernationEnabled } : undefined,
      ipv6AddressCount: props.ipv6AddressCount,
    });
    this.instance.node.addDependency(this.role);

    // if associatePublicIpAddress is true, then there must be a dependency on internet connectivity
    if (props.associatePublicIpAddress !== undefined && props.associatePublicIpAddress) {
      const internetConnected = props.vpc.selectSubnets(props.vpcSubnets).internetConnectivityEstablished;
      this.instance.node.addDependency(internetConnected);
    }

    if (!hasPublic && props.associatePublicIpAddress) {
      throw new Error("To set 'associatePublicIpAddress: true' you must select Public subnets (vpcSubnets: { subnetType: SubnetType.PUBLIC })");
    }

    this.osType = imageConfig.osType;
    this.node.defaultChild = this.instance;

    this.instanceId = this.instance.ref;
    this.instanceAvailabilityZone = this.instance.attrAvailabilityZone;
    this.instancePrivateDnsName = this.instance.attrPrivateDnsName;
    this.instancePrivateIp = this.instance.attrPrivateIp;
    this.instancePublicDnsName = this.instance.attrPublicDnsName;
    this.instancePublicIp = this.instance.attrPublicIp;

    if (props.init) {
      this.applyCloudFormationInit(props.init, props.initOptions);
    }

    this.applyUpdatePolicies(props);

    // Trigger replacement (via new logical ID) on user data change, if specified or cfn-init is being used.
    //
    // This is slightly tricky -- we need to resolve the UserData string (in order to get at actual Asset hashes,
    // instead of the Token stringifications of them ('${Token[1234]}'). However, in the case of CFN Init usage,
    // a UserData is going to contain the logicalID of the resource itself, which means infinite recursion if we
    // try to naively resolve. We need a recursion breaker in this.
    const originalLogicalId = Stack.of(this).getLogicalId(this.instance);
    let recursing = false;
    this.instance.overrideLogicalId(Lazy.uncachedString({
      produce: (context) => {
        if (recursing) { return originalLogicalId; }
        if (!(props.userDataCausesReplacement ?? props.initOptions)) { return originalLogicalId; }

        const fragments = new Array<string>();
        recursing = true;
        try {
          fragments.push(JSON.stringify(context.resolve(this.userData.render())));
        } finally {
          recursing = false;
        }
        const digest = md5hash(fragments.join('')).slice(0, 16);
        return `${originalLogicalId}${digest}`;
      },
    }));

    if (props.requireImdsv2) {
      Aspects.of(this).add(new InstanceRequireImdsv2Aspect());
    }
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
    this.role.addToPrincipalPolicy(statement);
  }

  /**
   * Use a CloudFormation Init configuration at instance startup
   *
   * This does the following:
   *
   * - Attaches the CloudFormation Init metadata to the Instance resource.
   * - Add commands to the instance UserData to run `cfn-init` and `cfn-signal`.
   * - Update the instance's CreationPolicy to wait for the `cfn-signal` commands.
   */
  public applyCloudFormationInit(init: CloudFormationInit, options: ApplyCloudFormationInitOptions = {}) {
    init.attach(this.instance, {
      platform: this.osType,
      instanceRole: this.role,
      userData: this.userData,
      configSets: options.configSets,
      embedFingerprint: options.embedFingerprint,
      printLog: options.printLog,
      ignoreFailures: options.ignoreFailures,
      includeRole: options.includeRole,
      includeUrl: options.includeUrl,
    });
    this.waitForResourceSignal(options.timeout ?? Duration.minutes(5));
  }

  /**
   * Wait for a single additional resource signal
   *
   * Add 1 to the current ResourceSignal Count and add the given timeout to the current timeout.
   *
   * Use this to pause the CloudFormation deployment to wait for the instances
   * in the AutoScalingGroup to report successful startup during
   * creation and updates. The UserData script needs to invoke `cfn-signal`
   * with a success or failure code after it is done setting up the instance.
   */
  private waitForResourceSignal(timeout: Duration) {
    const oldResourceSignal = this.instance.cfnOptions.creationPolicy?.resourceSignal;
    this.instance.cfnOptions.creationPolicy = {
      ...this.instance.cfnOptions.creationPolicy,
      resourceSignal: {
        count: (oldResourceSignal?.count ?? 0) + 1,
        timeout: (oldResourceSignal?.timeout ? Duration.parse(oldResourceSignal?.timeout).plus(timeout) : timeout).toIsoString(),
      },
    };
  }

  /**
   * Apply CloudFormation update policies for the instance
   */
  private applyUpdatePolicies(props: InstanceProps) {
    if (props.resourceSignalTimeout !== undefined) {
      this.instance.cfnOptions.creationPolicy = {
        ...this.instance.cfnOptions.creationPolicy,
        resourceSignal: {
          timeout: props.resourceSignalTimeout && props.resourceSignalTimeout.toIsoString(),
        },
      };
    }
  }
}

/**
 * Options for applying CloudFormation init to an instance or instance group
 */
export interface ApplyCloudFormationInitOptions {
  /**
   * ConfigSet to activate
   *
   * @default ['default']
   */
  readonly configSets?: string[];

  /**
   * Timeout waiting for the configuration to be applied
   *
   * @default Duration.minutes(5)
   */
  readonly timeout?: Duration;

  /**
   * Force instance replacement by embedding a config fingerprint
   *
   * If `true` (the default), a hash of the config will be embedded into the
   * UserData, so that if the config changes, the UserData changes.
   *
   * - If the EC2 instance is instance-store backed or
   *   `userDataCausesReplacement` is set, this will cause the instance to be
   *   replaced and the new configuration to be applied.
   * - If the instance is EBS-backed and `userDataCausesReplacement` is not
   *   set, the change of UserData will make the instance restart but not be
   *   replaced, and the configuration will not be applied automatically.
   *
   * If `false`, no hash will be embedded, and if the CloudFormation Init
   * config changes nothing will happen to the running instance. If a
   * config update introduces errors, you will not notice until after the
   * CloudFormation deployment successfully finishes and the next instance
   * fails to launch.
   *
   * @default true
   */
  readonly embedFingerprint?: boolean;

  /**
   * Print the results of running cfn-init to the Instance System Log
   *
   * By default, the output of running cfn-init is written to a log file
   * on the instance. Set this to `true` to print it to the System Log
   * (visible from the EC2 Console), `false` to not print it.
   *
   * (Be aware that the system log is refreshed at certain points in
   * time of the instance life cycle, and successful execution may
   * not always show up).
   *
   * @default true
   */
  readonly printLog?: boolean;

  /**
   * Don't fail the instance creation when cfn-init fails
   *
   * You can use this to prevent CloudFormation from rolling back when
   * instances fail to start up, to help in debugging.
   *
   * @default false
   */
  readonly ignoreFailures?: boolean;

  /**
   * Include --url argument when running cfn-init and cfn-signal commands
   *
   * This will be the cloudformation endpoint in the deployed region
   * e.g. https://cloudformation.us-east-1.amazonaws.com
   *
   * @default false
   */
  readonly includeUrl?: boolean;

  /**
   * Include --role argument when running cfn-init and cfn-signal commands
   *
   * This will be the IAM instance profile attached to the EC2 instance
   *
   * @default false
   */
  readonly includeRole?: boolean;
}

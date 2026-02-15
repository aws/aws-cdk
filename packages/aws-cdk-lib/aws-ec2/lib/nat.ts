import type { IConnectable } from './connections';
import { Connections } from './connections';
import { CfnNatGateway } from './ec2.generated';
import { Instance } from './instance';
import type { InstanceType } from './instance-types';
import { InstanceArchitecture } from './instance-types';
import type { IKeyPair } from './key-pair';
import type { CpuCredits } from './launch-template';
import type { IMachineImage } from './machine-image';
import { AmazonLinuxCpuType, AmazonLinuxGeneration, AmazonLinuxImage, LookupMachineImage } from './machine-image';
import { Port } from './port';
import type { ISecurityGroup } from './security-group';
import { SecurityGroup } from './security-group';
import { UserData } from './user-data';
import type { PrivateSubnet, PublicSubnet, Vpc } from './vpc';
import { RouterType } from './vpc';
import * as iam from '../../aws-iam';
import { Annotations, Duration, Fn, Token, UnscopedValidationError } from '../../core';
import { IEIPRef } from '../../interfaces/generated/aws-ec2-interfaces.generated';

/**
 * Direction of traffic to allow all by default.
 */
export enum NatTrafficDirection {
  /**
   * Allow all outbound traffic and disallow all inbound traffic.
   */
  OUTBOUND_ONLY = 'OUTBOUND_ONLY',

  /**
   * Allow all outbound and inbound traffic.
   */
  INBOUND_AND_OUTBOUND = 'INBOUND_AND_OUTBOUND',

  /**
   * Disallow all outbound and inbound traffic.
   */
  NONE = 'NONE',
}

/**
 * Pair represents a gateway created by NAT Provider
 */
export interface GatewayConfig {

  /**
   * Availability Zone
   */
  readonly az: string;

  /**
   * Identity of gateway spawned by the provider
   */
  readonly gatewayId: string;
}

/**
 * NAT providers
 *
 * Determines what type of NAT provider to create, either NAT gateways or NAT
 * instance.
 */
export abstract class NatProvider {
  /**
   * Use NAT Gateways to provide NAT services for your VPC
   *
   * NAT gateways are managed by AWS.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
   */
  public static gateway(props: NatGatewayProps = {}): NatProvider {
    return new NatGatewayProvider(props);
  }

  /**
   * Use NAT instances to provide NAT services for your VPC
   *
   * NAT instances are managed by you, but in return allow more configuration.
   *
   * Be aware that instances created using this provider will not be
   * automatically replaced if they are stopped for any reason. You should implement
   * your own NatProvider based on AutoScaling groups if you need that.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html
   *
   * @deprecated use instanceV2. 'instance' is deprecated since NatInstanceProvider
   * uses a instance image that has reached EOL on Dec 31 2023
   */
  public static instance(props: NatInstanceProps): NatInstanceProvider {
    return new NatInstanceProvider(props);
  }

  /**
   * Use NAT instances to provide NAT services for your VPC
   *
   * NAT instances are managed by you, but in return allow more configuration.
   *
   * Be aware that instances created using this provider will not be
   * automatically replaced if they are stopped for any reason. You should implement
   * your own NatProvider based on AutoScaling groups if you need that.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html
   */
  public static instanceV2(props: NatInstanceProps): NatInstanceProviderV2 {
    return new NatInstanceProviderV2(props);
  }

  /**
   * Use a Regional NAT Gateway to provide NAT services for your VPC
   *
   * Regional NAT Gateways provide automatic multi-AZ redundancy with a single
   * gateway that scales across availability zones. AWS automatically manages
   * AZ coverage and EIP allocation.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html
   */
  public static regionalGateway(props: RegionalNatGatewayProviderProps = {}): NatProvider {
    return new RegionalNatGatewayProvider(props);
  }

  /**
   * Return list of gateways spawned by the provider
   */
  public abstract readonly configuredGateways: GatewayConfig[];

  /**
   * Called by the VPC to configure NAT
   *
   * Don't call this directly, the VPC will call it automatically.
   */
  public abstract configureNat(options: ConfigureRegionalNatOptions): void;

  /**
   * Configures subnet with the gateway
   *
   * Don't call this directly, the VPC will call it automatically.
   */
  public abstract configureSubnet(subnet: PrivateSubnet): void;
}

/**
 * Options passed by the VPC when Regional NAT Gateway needs to be configured
 *
 * This is the base interface for NAT configuration, containing only the
 * properties needed for Regional NAT Gateways.
 */
export interface ConfigureRegionalNatOptions {
  /**
   * The VPC we're configuring NAT for
   */
  readonly vpc: Vpc;

  /**
   * The private subnets that need to route through the NAT providers.
   *
   * There may be more private subnets than public subnets with NAT providers.
   */
  readonly privateSubnets: PrivateSubnet[];
}

/**
 * Options passed by the VPC when NAT needs to be configured
 *
 * Extends ConfigureRegionalNatOptions with natSubnets for zonal NAT Gateways
 * and NAT instances.
 */
export interface ConfigureNatOptions extends ConfigureRegionalNatOptions {
  /**
   * The public subnets where the NAT providers need to be placed.
   */
  readonly natSubnets: PublicSubnet[];
}

/**
 * Properties for a NAT gateway
 *
 */
export interface NatGatewayProps {
  /**
   * EIP allocation IDs for the NAT gateways
   *
   * @default - No fixed EIPs allocated for the NAT gateways
   */
  readonly eipAllocationIds?: string[];

  /**
   * Maximum amount of time to wait before forcibly releasing IP addresses
   * if connections are still in progress.
   *
   * @default Duration.seconds(350)
   */
  readonly maxDrainDuration?: Duration;
}

/**
 * Configuration for a specific Availability Zone in a Regional NAT Gateway.
 *
 * This is used to manually specify which EIPs to use in each AZ.
 */
export interface AvailabilityZoneAddress {
  /**
   * The allocation IDs of the Elastic IP addresses to be used for handling
   * outbound NAT traffic in this specific Availability Zone.
   */
  readonly allocationIds: string[];

  /**
   * The Availability Zone where this specific NAT gateway configuration will be active.
   *
   * Either `availabilityZone` or `availabilityZoneId` must be specified.
   *
   * @default - Use availabilityZoneId instead
   */
  readonly availabilityZone?: string;

  /**
   * The ID of the Availability Zone where this specific NAT gateway configuration will be active.
   *
   * Either `availabilityZone` or `availabilityZoneId` must be specified.
   *
   * @default - Use availabilityZone instead
   */
  readonly availabilityZoneId?: string;
}

/**
 * Properties for a Regional NAT Gateway Provider
 *
 * Regional NAT Gateways provide automatic multi-AZ redundancy with a single
 * gateway that scales across availability zones.
 */
export interface RegionalNatGatewayProviderProps {
  /**
   * Maximum amount of time to wait before forcibly releasing IP addresses
   * if connections are still in progress.
   *
   * @default Duration.seconds(350)
   */
  readonly maxDrainDuration?: Duration;

  /**
   * The allocation ID of the Elastic IP address to use for this NAT gateway.
   *
   * Cannot be specified together with `eip`.
   * Ignored when `availabilityZoneAddresses` is specified.
   *
   * @default - A new EIP is automatically allocated
   */
  readonly allocationId?: string;

  /**
   * Reference to an existing EIP to use for this NAT gateway.
   *
   * Cannot be specified together with `allocationId`.
   * Ignored when `availabilityZoneAddresses` is specified.
   *
   * @default - A new EIP is automatically allocated
   */
  readonly eip?: IEIPRef;

  /**
   * Specifies which Availability Zones you want the NAT gateway to support
   * and the Elastic IP addresses to use in each AZ.
   *
   * When specified, `allocationId` and `eip` are ignored.
   * This enables manual mode for Regional NAT Gateway where you control EIP allocation per AZ.
   *
   * @default - Automatic mode: AWS manages AZ coverage and EIP allocation
   */
  readonly availabilityZoneAddresses?: AvailabilityZoneAddress[];
}

/**
 * Properties for a NAT instance
 */
export interface NatInstanceProps {
  /**
   * The machine image (AMI) to use
   *
   * By default, will do an AMI lookup for the latest NAT instance image.
   *
   * If you have a specific AMI ID you want to use, pass a `GenericLinuxImage`. For example:
   *
   * ```ts
   * ec2.NatProvider.instance({
   *   instanceType: new ec2.InstanceType('t3.micro'),
   *   machineImage: new ec2.GenericLinuxImage({
   *     'us-east-2': 'ami-0f9c61b5a562a16af'
   *   })
   * })
   * ```
   *
   * @default - Latest NAT instance image
   */
  readonly machineImage?: IMachineImage;

  /**
   * Instance type of the NAT instance
   */
  readonly instanceType: InstanceType;

  /**
   * Whether to associate a public IP address to the primary network interface attached to this instance.
   *
   * @default undefined - No public IP address associated
   */
  readonly associatePublicIpAddress?: boolean;

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
   * Security Group for NAT instances
   *
   * @default - A new security group will be created
   * @deprecated - Cannot create a new security group before the VPC is created,
   * and cannot create the VPC without the NAT provider.
   * Set {@link defaultAllowedTraffic} to {@link NatTrafficDirection.NONE}
   * and use {@link NatInstanceProviderV2.gatewayInstances} to retrieve
   * the instances on the fly and add security groups
   *
   * @example
   * const natGatewayProvider = ec2.NatProvider.instanceV2({
   *   instanceType: new ec2.InstanceType('t3.small'),
   *   defaultAllowedTraffic: ec2.NatTrafficDirection.NONE,
   * });
   * const vpc = new ec2.Vpc(this, 'Vpc', { natGatewayProvider });
   *
   * const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
   *   vpc,
   *   allowAllOutbound: false,
   * });
   * securityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
   * for (const gatewayInstance of natGatewayProvider.gatewayInstances) {
   *    gatewayInstance.addSecurityGroup(securityGroup);
   * }
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * Allow all inbound traffic through the NAT instance
   *
   * If you set this to false, you must configure the NAT instance's security
   * groups in another way, either by passing in a fully configured Security
   * Group using the `securityGroup` property, or by configuring it using the
   * `.securityGroup` or `.connections` members after passing the NAT Instance
   * Provider to a Vpc.
   *
   * @default true
   * @deprecated - Use `defaultAllowedTraffic`.
   */
  readonly allowAllTraffic?: boolean;

  /**
   * Direction to allow all traffic through the NAT instance by default.
   *
   * By default, inbound and outbound traffic is allowed.
   *
   * If you set this to another value than INBOUND_AND_OUTBOUND, you must
   * configure the NAT instance's security groups in another way, either by
   * passing in a fully configured Security Group using the `securityGroup`
   * property, or by configuring it using the `.securityGroup` or
   * `.connections` members after passing the NAT Instance Provider to a Vpc.
   *
   * @default NatTrafficDirection.INBOUND_AND_OUTBOUND
   */
  readonly defaultAllowedTraffic?: NatTrafficDirection;

  /**
   * Specifying the CPU credit type for burstable EC2 instance types (T2, T3, T3a, etc).
   * The unlimited CPU credit option is not supported for T3 instances with dedicated host (`host`) tenancy.
   *
   * @default - T2 instances are standard, while T3, T4g, and T3a instances are unlimited.
   */
  readonly creditSpecification?: CpuCredits;

  /**
   * Custom user data to run on the NAT instances
   *
   * @default UserData.forLinux().addCommands(...NatInstanceProviderV2.DEFAULT_USER_DATA_COMMANDS);  - Appropriate user data commands to initialize and configure the NAT instances
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#create-nat-ami
   */
  readonly userData?: UserData;
}

/**
 * Provider for NAT Gateways
 */
export class NatGatewayProvider extends NatProvider {
  private gateways: PrefSet<string> = new PrefSet<string>();

  constructor(private readonly props: NatGatewayProps = {}) {
    super();

    if (this.props.maxDrainDuration !== undefined) {
      const seconds = this.props.maxDrainDuration.toSeconds({ integral: false });
      if (seconds < 1 || seconds > 4000) {
        throw new UnscopedValidationError(
          `\`maxDrainDuration\` must be between 1 and 4000 seconds, got ${seconds} seconds.`,
        );
      }
    }
  }

  public configureNat(options: ConfigureNatOptions) {
    if (
      this.props.eipAllocationIds != null
      && !Token.isUnresolved(this.props.eipAllocationIds)
      && this.props.eipAllocationIds.length < options.natSubnets.length
    ) {
      throw new UnscopedValidationError(`Not enough NAT gateway EIP allocation IDs (${this.props.eipAllocationIds.length} provided) for the requested subnet count (${options.natSubnets.length} needed).`);
    }

    // Create the NAT gateways
    let i = 0;
    for (const sub of options.natSubnets) {
      const eipAllocationId = this.props.eipAllocationIds ? pickN(i, this.props.eipAllocationIds) : undefined;
      const gateway = sub.addNatGateway(eipAllocationId, this.props.maxDrainDuration?.toSeconds());
      this.gateways.add(sub.availabilityZone, gateway.ref);
      i++;
    }

    // Add routes to them in the private subnets
    for (const sub of options.privateSubnets) {
      this.configureSubnet(sub);
    }
  }

  public configureSubnet(subnet: PrivateSubnet) {
    const az = subnet.availabilityZone;
    const gatewayId = this.gateways.pick(az);
    subnet.addRoute('DefaultRoute', {
      routerType: RouterType.NAT_GATEWAY,
      routerId: gatewayId,
      enablesInternetConnectivity: true,
    });
  }

  public get configuredGateways(): GatewayConfig[] {
    return this.gateways.values().map(x => ({ az: x[0], gatewayId: x[1] }));
  }
}

/**
 * Provider for Regional NAT Gateways
 *
 * Regional NAT Gateways provide automatic multi-AZ redundancy with a single gateway that scales across availability zones.
 * Unlike zonal NAT gateways, a regional NAT gateway does not require a public subnet and is created at the VPC level.
 *
 * @see https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html
 */
export class RegionalNatGatewayProvider extends NatProvider {
  /**
   * The Regional NAT Gateway created by this provider
   */
  public natGateway?: CfnNatGateway;

  constructor(private readonly props: RegionalNatGatewayProviderProps = {}) {
    super();

    if (this.props.allocationId && this.props.eip) {
      throw new UnscopedValidationError(
        'Cannot specify both `allocationId` and `eip`. Use one or the other.',
      );
    }

    if (this.props.availabilityZoneAddresses) {
      if (this.props.availabilityZoneAddresses.length === 0) {
        throw new UnscopedValidationError(
          '`availabilityZoneAddresses` cannot be an empty array.',
        );
      }
      if (this.props.availabilityZoneAddresses.some(az => !az.availabilityZone && !az.availabilityZoneId)) {
        throw new UnscopedValidationError(
          'Either `availabilityZone` or `availabilityZoneId` must be specified in `AvailabilityZoneAddress`.',
        );
      }
      if (this.props.availabilityZoneAddresses.some(az => az.allocationIds.length === 0)) {
        throw new UnscopedValidationError(
          '`allocationIds` cannot be an empty array in `AvailabilityZoneAddress`.',
        );
      }
    }

    if (this.props.maxDrainDuration !== undefined) {
      const seconds = this.props.maxDrainDuration.toSeconds({ integral: false });
      if (seconds < 1 || seconds > 4000) {
        throw new UnscopedValidationError(
          `\`maxDrainDuration\` must be between 1 and 4000 seconds, got ${seconds} seconds.`,
        );
      }
    }
  }

  public configureNat(options: ConfigureRegionalNatOptions) {
    // Warn if availabilityZoneAddresses is specified with allocationId/eip
    // allocationId/eip will be ignored in that case
    if (this.props.availabilityZoneAddresses && (this.props.allocationId || this.props.eip)) {
      Annotations.of(options.vpc).addWarningV2(
        '@aws-cdk/aws-ec2:regionalNatGatewayAllocationIdIgnored',
        '`allocationId` and `eip` are ignored when `availabilityZoneAddresses` is specified.',
      );
    }

    this.natGateway = new CfnNatGateway(options.vpc, 'RegionalNatGateway', {
      vpcId: options.vpc.vpcId,
      availabilityMode: 'regional',
      connectivityType: 'public',
      allocationId: this.props.allocationId ?? this.props.eip,
      availabilityZoneAddresses: this.props.availabilityZoneAddresses,
      maxDrainDurationSeconds: this.props.maxDrainDuration?.toSeconds(),
    });

    // Add routes to the regional NAT gateway in all private subnets
    for (const sub of options.privateSubnets) {
      this.configureSubnet(sub);
    }
  }

  public configureSubnet(subnet: PrivateSubnet) {
    if (!this.natGateway) {
      throw new UnscopedValidationError('Cannot configure subnet before configuring NAT gateway');
    }
    // All private subnets use the same regional NAT gateway ID
    subnet.addRoute('DefaultRoute', {
      routerType: RouterType.NAT_GATEWAY,
      routerId: this.natGateway.attrNatGatewayId,
      enablesInternetConnectivity: true,
    });
  }

  public get configuredGateways(): GatewayConfig[] {
    // Regional NAT gateway is a single gateway covering all AZs
    return this.natGateway
      ? [{ az: 'regional', gatewayId: this.natGateway.attrNatGatewayId }]
      : [];
  }
}

/**
 * NAT provider which uses NAT Instances
 *
 * @deprecated use NatInstanceProviderV2. NatInstanceProvider is deprecated since
 * the instance image used has reached EOL on Dec 31 2023
 */
export class NatInstanceProvider extends NatProvider implements IConnectable {
  private gateways: PrefSet<Instance> = new PrefSet<Instance>();
  private _securityGroup?: ISecurityGroup;
  private _connections?: Connections;

  constructor(private readonly props: NatInstanceProps) {
    super();

    if (props.defaultAllowedTraffic !== undefined && props.allowAllTraffic !== undefined) {
      throw new UnscopedValidationError('Can not specify both of \'defaultAllowedTraffic\' and \'defaultAllowedTraffic\'; prefer \'defaultAllowedTraffic\'');
    }

    if (props.keyName && props.keyPair) {
      throw new UnscopedValidationError('Cannot specify both of \'keyName\' and \'keyPair\'; prefer \'keyPair\'');
    }
  }

  public configureNat(options: ConfigureNatOptions) {
    const defaultDirection = this.props.defaultAllowedTraffic ??
      (this.props.allowAllTraffic ?? true ? NatTrafficDirection.INBOUND_AND_OUTBOUND : NatTrafficDirection.OUTBOUND_ONLY);

    // Create the NAT instances. They can share a security group and a Role.
    const machineImage = this.props.machineImage ?? new NatInstanceImage();
    this._securityGroup = this.props.securityGroup ?? new SecurityGroup(options.vpc, 'NatSecurityGroup', {
      vpc: options.vpc,
      description: 'Security Group for NAT instances',
      allowAllOutbound: isOutboundAllowed(defaultDirection),
    });
    this._connections = new Connections({ securityGroups: [this._securityGroup] });

    if (isInboundAllowed(defaultDirection)) {
      this.connections.allowFromAnyIpv4(Port.allTraffic());
    }

    // FIXME: Ideally, NAT instances don't have a role at all, but
    // 'Instance' does not allow that right now.
    const role = new iam.Role(options.vpc, 'NatRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    for (const sub of options.natSubnets) {
      const natInstance = new Instance(sub, 'NatInstance', {
        instanceType: this.props.instanceType,
        machineImage,
        sourceDestCheck: false, // Required for NAT
        vpc: options.vpc,
        vpcSubnets: { subnets: [sub] },
        securityGroup: this._securityGroup,
        role,
        keyPair: this.props.keyPair,
        keyName: this.props.keyName,
        creditSpecification: this.props.creditSpecification,
      });
      // NAT instance routes all traffic, both ways
      this.gateways.add(sub.availabilityZone, natInstance);
    }

    // Add routes to them in the private subnets
    for (const sub of options.privateSubnets) {
      this.configureSubnet(sub);
    }
  }

  /**
   * The Security Group associated with the NAT instances
   */
  public get securityGroup(): ISecurityGroup {
    if (!this._securityGroup) {
      throw new UnscopedValidationError('Pass the NatInstanceProvider to a Vpc before accessing \'securityGroup\'');
    }
    return this._securityGroup;
  }

  /**
   * Manage the Security Groups associated with the NAT instances
   */
  public get connections(): Connections {
    if (!this._connections) {
      throw new UnscopedValidationError('Pass the NatInstanceProvider to a Vpc before accessing \'connections\'');
    }
    return this._connections;
  }

  public get configuredGateways(): GatewayConfig[] {
    return this.gateways.values().map(x => ({ az: x[0], gatewayId: x[1].instanceId }));
  }

  public configureSubnet(subnet: PrivateSubnet) {
    const az = subnet.availabilityZone;
    const gatewayId = this.gateways.pick(az).instanceId;
    subnet.addRoute('DefaultRoute', {
      routerType: RouterType.INSTANCE,
      routerId: gatewayId,
      enablesInternetConnectivity: true,
    });
  }
}

/**
 * Preferential set
 *
 * Picks the value with the given key if available, otherwise distributes
 * evenly among the available options.
 */
class PrefSet<A> {
  private readonly map: Record<string, A> = {};
  private readonly vals = new Array<[string, A]>();
  private next: number = 0;

  public add(pref: string, value: A) {
    this.map[pref] = value;
    this.vals.push([pref, value]);
  }

  public pick(pref: string): A {
    if (this.vals.length === 0) {
      throw new UnscopedValidationError('Cannot pick, set is empty');
    }

    if (pref in this.map) { return this.map[pref]; }
    return this.vals[this.next++ % this.vals.length][1];
  }

  public values(): Array<[string, A]> {
    return this.vals;
  }
}

/**
 * Modern NAT provider which uses NAT Instances.
 * The instance uses Amazon Linux 2023 as the operating system.
 */
export class NatInstanceProviderV2 extends NatProvider implements IConnectable {
  /**
   * Amazon Linux 2023 NAT instance user data commands
   * Enable iptables on the instance, enable persistent IP forwarding, configure NAT on instance
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#create-nat-ami
   */
  public static readonly DEFAULT_USER_DATA_COMMANDS = [
    'yum install iptables-services -y',
    'systemctl enable iptables',
    'systemctl start iptables',
    'echo "net.ipv4.ip_forward=1" > /etc/sysctl.d/custom-ip-forwarding.conf',
    'sudo sysctl -p /etc/sysctl.d/custom-ip-forwarding.conf',
    "sudo /sbin/iptables -t nat -A POSTROUTING -o $(route | awk '/^default/{print $NF}') -j MASQUERADE",
    'sudo /sbin/iptables -F FORWARD',
    'sudo service iptables save',
  ];

  private gateways: PrefSet<Instance> = new PrefSet<Instance>();
  private _securityGroup?: ISecurityGroup;
  private _connections?: Connections;

  /**
   * Array of gateway instances spawned by the provider after internal configuration
   */
  public get gatewayInstances(): Instance[] {
    return this.gateways.values().map(([, instance]) => instance);
  }

  constructor(private readonly props: NatInstanceProps) {
    super();

    if (props.defaultAllowedTraffic !== undefined && props.allowAllTraffic !== undefined) {
      throw new UnscopedValidationError('Can not specify both of \'defaultAllowedTraffic\' and \'defaultAllowedTraffic\'; prefer \'defaultAllowedTraffic\'');
    }

    if (props.keyName && props.keyPair) {
      throw new UnscopedValidationError('Cannot specify both of \'keyName\' and \'keyPair\'; prefer \'keyPair\'');
    }
  }

  public configureNat(options: ConfigureNatOptions) {
    const defaultDirection = this.props.defaultAllowedTraffic ??
      (this.props.allowAllTraffic ?? true ? NatTrafficDirection.INBOUND_AND_OUTBOUND : NatTrafficDirection.OUTBOUND_ONLY);

    // Create the NAT instances. They can share a security group and a Role. The new NAT instance created uses latest
    // Amazon Linux 2023 image. This is important since the original NatInstanceProvider uses an instance image that has
    // reached EOL on Dec 31 2023
    const machineImage = this.props.machineImage || new AmazonLinuxImage({
      generation: AmazonLinuxGeneration.AMAZON_LINUX_2023,
      cpuType: this.props.instanceType.architecture == InstanceArchitecture.ARM_64 ? AmazonLinuxCpuType.ARM_64 : undefined,
    });
    this._securityGroup = this.props.securityGroup ?? new SecurityGroup(options.vpc, 'NatSecurityGroup', {
      vpc: options.vpc,
      description: 'Security Group for NAT instances',
      allowAllOutbound: isOutboundAllowed(defaultDirection),
    });
    this._connections = new Connections({ securityGroups: [this._securityGroup] });

    if (isInboundAllowed(defaultDirection)) {
      this.connections.allowFromAnyIpv4(Port.allTraffic());
    }

    let userData = this.props.userData;
    if (!userData) {
      userData = UserData.forLinux();
      userData.addCommands(...NatInstanceProviderV2.DEFAULT_USER_DATA_COMMANDS);
    }

    for (const sub of options.natSubnets) {
      const natInstance = new Instance(sub, 'NatInstance', {
        instanceType: this.props.instanceType,
        machineImage,
        sourceDestCheck: false, // Required for NAT
        vpc: options.vpc,
        vpcSubnets: { subnets: [sub] },
        associatePublicIpAddress: this.props.associatePublicIpAddress,
        securityGroup: this._securityGroup,
        keyPair: this.props.keyPair,
        keyName: this.props.keyName,
        creditSpecification: this.props.creditSpecification,
        userData,
      });
      // NAT instance routes all traffic, both ways
      this.gateways.add(sub.availabilityZone, natInstance);
    }

    // Add routes to them in the private subnets
    for (const sub of options.privateSubnets) {
      this.configureSubnet(sub);
    }
  }

  /**
   * The Security Group associated with the NAT instances
   */
  public get securityGroup(): ISecurityGroup {
    if (!this._securityGroup) {
      throw new UnscopedValidationError('Pass the NatInstanceProvider to a Vpc before accessing \'securityGroup\'');
    }
    return this._securityGroup;
  }

  /**
   * Manage the Security Groups associated with the NAT instances
   */
  public get connections(): Connections {
    if (!this._connections) {
      throw new UnscopedValidationError('Pass the NatInstanceProvider to a Vpc before accessing \'connections\'');
    }
    return this._connections;
  }

  public get configuredGateways(): GatewayConfig[] {
    return this.gateways.values().map(x => ({ az: x[0], gatewayId: x[1].instanceId }));
  }

  public configureSubnet(subnet: PrivateSubnet) {
    const az = subnet.availabilityZone;
    const gatewayId = this.gateways.pick(az).instanceId;
    subnet.addRoute('DefaultRoute', {
      routerType: RouterType.INSTANCE,
      routerId: gatewayId,
      enablesInternetConnectivity: true,
    });
  }
}

/**
 * Machine image representing the latest NAT instance image
 *
 *
 */
export class NatInstanceImage extends LookupMachineImage {
  constructor() {
    super({
      name: 'amzn-ami-vpc-nat-*',
      owners: ['amazon'],
    });
  }
}

function isOutboundAllowed(direction: NatTrafficDirection) {
  return direction === NatTrafficDirection.INBOUND_AND_OUTBOUND ||
    direction === NatTrafficDirection.OUTBOUND_ONLY;
}

function isInboundAllowed(direction: NatTrafficDirection) {
  return direction === NatTrafficDirection.INBOUND_AND_OUTBOUND;
}

/**
 * Token-aware pick index function
 */
function pickN(i: number, xs: string[]) {
  if (Token.isUnresolved(xs)) { return Fn.select(i, xs); }

  if (i >= xs.length) {
    throw new UnscopedValidationError(`Cannot get element ${i} from ${xs}`);
  }

  return xs[i];
}

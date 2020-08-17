import * as iam from '@aws-cdk/aws-iam';
import { Connections, IConnectable } from './connections';
import { Instance } from './instance';
import { InstanceType } from './instance-types';
import { IMachineImage, LookupMachineImage } from './machine-image';
import { Port } from './port';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { PrivateSubnet, PublicSubnet, RouterType, Vpc } from './vpc';

/**
 * Pair represents a gateway created by NAT Provider
 */
export interface GatewayConfig {

  /**
   * Availability Zone
   */
  readonly az: string

  /**
   * Identity of gateway spawned by the provider
   */
  readonly gatewayId: string
}

/**
 * NAT providers
 *
 * Determines what type of NAT provider to create, either NAT gateways or NAT
 * instance.
 *
 * @experimental
 */
export abstract class NatProvider {
  /**
   * Use NAT Gateways to provide NAT services for your VPC
   *
   * NAT gateways are managed by AWS.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
   */
  public static gateway(): NatProvider {
    return new NatGatewayProvider();
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
  public static instance(props: NatInstanceProps): NatInstanceProvider {
    return new NatInstanceProvider(props);
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
  public abstract configureNat(options: ConfigureNatOptions): void;

  /**
   * Configures subnet with the gateway
   *
   * Don't call this directly, the VPC will call it automatically.
   */
  public abstract configureSubnet(subnet: PrivateSubnet): void;
}

/**
 * Options passed by the VPC when NAT needs to be configured
 *
 * @experimental
 */
export interface ConfigureNatOptions {
  /**
   * The VPC we're configuring NAT for
   */
  readonly vpc: Vpc;

  /**
   * The public subnets where the NAT providers need to be placed
   */
  readonly natSubnets: PublicSubnet[];

  /**
   * The private subnets that need to route through the NAT providers.
   *
   * There may be more private subnets than public subnets with NAT providers.
   */
  readonly privateSubnets: PrivateSubnet[];
}

/**
 * Properties for a NAT instance
 *
 * @experimental
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
   * Name of SSH keypair to grant access to instance
   *
   * @default - No SSH access will be possible.
   */
  readonly keyName?: string;

  /**
   * Security Group for NAT instances
   *
   * @default - A new security group will be created
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * Allow all traffic through the NAT instance
   *
   * If you set this to false, you must configure the NAT instance's security
   * groups in another way, either by passing in a fully configured Security
   * Group using the `securityGroup` property, or by configuring it using the
   * `.securityGroup` or `.connections` members after passing the NAT Instance
   * Provider to a Vpc.
   *
   * @default true
   */
  readonly allowAllTraffic?: boolean;
}

/**
 * Provider for NAT Gateways
 */
class NatGatewayProvider extends NatProvider {
  private gateways: PrefSet<string> = new PrefSet<string>();

  public configureNat(options: ConfigureNatOptions) {
    // Create the NAT gateways
    for (const sub of options.natSubnets) {
      const gateway = sub.addNatGateway();
      this.gateways.add(sub.availabilityZone, gateway.ref);
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
 * NAT provider which uses NAT Instances
 */
export class NatInstanceProvider extends NatProvider implements IConnectable {
  private gateways: PrefSet<Instance> = new PrefSet<Instance>();
  private _securityGroup?: ISecurityGroup;
  private _connections?: Connections;

  constructor(private readonly props: NatInstanceProps) {
    super();
  }

  public configureNat(options: ConfigureNatOptions) {
    // Create the NAT instances. They can share a security group and a Role.
    const machineImage = this.props.machineImage || new NatInstanceImage();
    this._securityGroup = this.props.securityGroup ?? new SecurityGroup(options.vpc, 'NatSecurityGroup', {
      vpc: options.vpc,
      description: 'Security Group for NAT instances',
    });
    this._connections = new Connections({ securityGroups: [this._securityGroup] });

    if (this.props.allowAllTraffic ?? true) {
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
        keyName: this.props.keyName,
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
      throw new Error('Pass the NatInstanceProvider to a Vpc before accessing \'securityGroup\'');
    }
    return this._securityGroup;
  }

  /**
   * Manage the Security Groups associated with the NAT instances
   */
  public get connections(): Connections {
    if (!this._connections) {
      throw new Error('Pass the NatInstanceProvider to a Vpc before accessing \'connections\'');
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
      throw new Error('Cannot pick, set is empty');
    }

    if (pref in this.map) { return this.map[pref]; }
    return this.vals[this.next++ % this.vals.length][1];
  }

  public values(): Array<[string, A]> {
    return this.vals;
  }
}

/**
 * Machine image representing the latest NAT instance image
 *
 * @experimental
 */
export class NatInstanceImage extends LookupMachineImage {
  constructor() {
    super({
      name: 'amzn-ami-vpc-nat-*',
      owners: ['amazon'],
    });
  }
}

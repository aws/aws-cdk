import { Construct } from 'constructs';
import { Connections, IConnectable } from './connections';
import { CfnNetworkInterface, CfnNetworkInterfaceAttachment } from './ec2.generated';
import { IInstance } from './instance';
import { CidrBlock, NetworkUtils } from './network-util';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { IVpc, SubnetSelection } from './vpc';
import { IResource, Lazy, Resource, Tags } from '../../core';

/**
 * Type of network interface.
 */
export enum NetworkInterfaceType {
  /**
   * Interface type. This is default type.
   */
  INTERFACE = 'interface',
  /**
   * Elastic Fabric Adapter (EFA) type.
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html
   */
  EFA = 'efa',
  /**
   * Trunk type. This type uses for ENI trunking.
   * @see https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/networking-networkmode-awsvpc.html#networking-networkmode-awsvpc-enitrunking
   */
  TRUNK = 'trunk',
}

type OmitFunction<T> = {
  [P in keyof T as T[P] extends Function ? never : P]: T[P]
}
/**
 * Private IPv4 address assign.
 */
export class Ipv4Assign {
  /**
   * Assign IPv4 address from only primary address.
   * @param ipAddress Primary IPv4 address
   */
  public static fromPrimaryIpAddress(ipAddress: string): Ipv4Assign {
    if (!NetworkUtils.validIp(ipAddress)) {
      throw new Error(`${ipAddress} is not valid IPv4 address.`);
    }
    return new Ipv4Assign({
      _primaryIpAddress: ipAddress,
    });
  }
  /**
   * Assign IPv4 address from address count.
   * @param count The number of IPv4 addresses
   */
  public static fromIpAddressCount(count: number): Ipv4Assign {
    return new Ipv4Assign({
      _ipAddressCount: count,
    });
  }
  /**
   * Assign IPv4 address from addresses.
   * @param ipAddresses Array of IPv4 addresses
   */
  public static fromIpAdresses(...ipAddresses: string[]): Ipv4Assign {
    for (const ipAddress of ipAddresses) {
      if (!NetworkUtils.validIp(ipAddress)) {
        throw new Error(`${ipAddress} is not valid IPv4 address.`);
      }
    }
    return new Ipv4Assign({
      _ipAddresses: ipAddresses,
    });
  }
  /**
   * Assign IPv4 address from prefix count.
   * @param count The number of prefixes
   */
  public static fromPrefixCount(count: number): Ipv4Assign {
    return new Ipv4Assign({
      _prefixCount: count,
    });
  }
  /**
   * Assign IPv4 address from prefixes.
   * @param prefixes The prefixes must be end with /28
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-prefix-eni.html#ec2-prefix-basics
   * @example
   * ec2.Ipv4Assign.fromPrefixes('10.0.0.0/28', '10.1.0.0/28');
   */
  public static fromPrefixes(...prefixes: string[]): Ipv4Assign {
    const cidrBlocks = prefixes.map((prefix) => new CidrBlock(prefix));
    if (cidrBlocks.find(cidr => cidr.mask !== 28)) {
      throw new Error('IPv4 prefix must be end with /28');
    }
    return new Ipv4Assign({
      _prefixes: cidrBlocks.map((cidr) => cidr.cidr),
    });
  }

  /**
   * @internal
   */
  readonly _prefixCount?: number;
  /**
   * @internal
   */
  readonly _prefixes?: string[];
  /**
   * @internal
   */
  readonly _primaryIpAddress?: string;
  /**
   * @internal
   */
  readonly _ipAddresses?: string[];
  /**
   * @internal
   */
  readonly _ipAddressCount?: number;

  private constructor(options: OmitFunction<Ipv4Assign>) {
    this._prefixCount = options._prefixCount;
    this._prefixes = options._prefixes;
    this._primaryIpAddress = options._primaryIpAddress;
    this._ipAddresses = options._ipAddresses;
    this._ipAddressCount = options._ipAddressCount;
  }

  /**
   * Adding primary IPv4 address. This function support only when created by Ipv4Assign.fromAdresses().
   * @param primaryIpAddress The primary IPv4 address to be added. It doesn't matter if it's an IPv4 address that's already set for this instance.
   * @returns Instance with a primary IPv4 address added
   */
  public addPrimaryAddress(primaryIpAddress: string): Ipv4Assign {
    if (this._primaryIpAddress) {
      throw new Error(`You try add the primary IPv4 address ${primaryIpAddress}, but already set the ${this._primaryIpAddress}`);
    }
    return new Ipv4Assign({
      _ipAddressCount: this._ipAddressCount,
      _ipAddresses: this._ipAddresses,
      _prefixCount: this._prefixCount,
      _prefixes: this._prefixes,
      _primaryIpAddress: primaryIpAddress,
    });
  }
}

/**
 * Interface of network interface.
 */
export interface INetworkInterface extends IResource, IConnectable {
  /**
   * The ID of network interface.
   * @attribute
   */
  readonly networkInterfaceId: string;
  /**
   * Attach this network interface to the instance.
   * @param instance The instance to attach.
   * @param deviceIndex The index of attach device.
   * @param options Attach options.
   */
  attachToInstance(instance: IInstance, deviceIndex: number, options?: AttachNetworkInterfaceOptions): void;
}

/**
 * Options for attach network interface to the instance.
 */
export interface AttachNetworkInterfaceOptions {
  /**
   * Whether to delete the network interface when the instance terminates.
   *
   * @default true
   */
  readonly deleteOnTermination?: boolean;
}

abstract class NetworkInterfaceBase extends Resource implements INetworkInterface {
  abstract readonly networkInterfaceId: string;
  abstract readonly connections: Connections;
  private attachedInstance?: IInstance;
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
  attachToInstance(instance: IInstance, deviceIndex: number, options: AttachNetworkInterfaceOptions = {}) {
    if (this.attachedInstance) {
      throw new Error(`You try attach to ${instance.instanceId}, but ${this.node.path} is already attached to ${this.attachedInstance.instanceId}`);
    }
    this.attachedInstance = instance;
    new CfnNetworkInterfaceAttachment(this, 'Attachment', {
      deviceIndex: deviceIndex.toString(),
      instanceId: instance.instanceId,
      networkInterfaceId: this.networkInterfaceId,
      deleteOnTermination: options.deleteOnTermination,
    });
  }
}

/**
 * Props of network interface.
 */
export interface NetworkInterfaceProps {
  /**
   * The vpc to associate with this network interface.
   */
  readonly vpc: IVpc;
  /**
   * Which VPC subnets to use for your network interface.
   *
   * @default - Private subnets.
   */
  readonly vpcSubnets?: SubnetSelection;
  /**
   * The type of network interface.
   *
   * @default NetworkInterfaceType.INTERFACE
   */
  readonly interfaceType?: NetworkInterfaceType;
  /**
   * The name of network interface.
   *
   * @default - CDK generated name
   */
  readonly networkInterfaceName?: string;
  /**
   * A description of the nwtwork interface.
   *
   * @default - The default name will be the construct's CDK path.
   */
  readonly description?: string;
  /**
   * Security groups to assign to network interface.
   *
   * @default - create a new security group
   */
  readonly securityGroups?: ISecurityGroup[];
  /**
   * Whether the network interface could initiate connections to anywhere by default.
   * This property is only used when you do not provide a security group.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;
  /**
   * The private IPv4 address to assign to the network interface.
   *
   * @default - Auto-assign only primary IPv4 address.
   */
  readonly ipv4?: Ipv4Assign;
  /**
   * Enable or disable source/destination checks,
   * which ensure that the instance is either the source or the destination of any traffic that it receives.
   * If the value is true, source/destination checks are enabled; otherwise, they are disabled.
   * You must disable source/destination checks if the instance runs services such as network address translation, routing, or firewalls.
   *
   * @default true
   */
  readonly sourceDestCheck?: boolean;
}

/**
 * Attributes of network interface for import.
 */
export interface NetworkInterfaceAttributes {
  /**
   * The ID of network interface.
   */
  readonly networkInterfaceId: string;
  /**
   * Security groups to assign to this network interface.
   *
   * @default - No assign security groups.
   */
  readonly securityGroups?: ISecurityGroup[];
}
/**
 * Creates an Amazon EC2 network interface within a VPC.
 */
export class NetworkInterface extends NetworkInterfaceBase {
  /**
   * Import an existing network interface into this app.
   */
  public static fromNetworkInterfaceAttributes(scope: Construct, id: string, attrs: NetworkInterfaceAttributes): INetworkInterface {
    return new class Import extends NetworkInterfaceBase {
      public readonly networkInterfaceId: string = attrs.networkInterfaceId;
      public readonly connections: Connections = new Connections({
        securityGroups: attrs.securityGroups,
      })
      constructor() {
        super(scope, id);
      }
    };
  }

  public readonly networkInterfaceId: string;
  public readonly connections: Connections;
  constructor(scope: Construct, id: string, props: NetworkInterfaceProps) {
    super(scope, id);
    const securityGroups = props.securityGroups ?? [
      new SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        allowAllOutbound: props.allowAllOutbound,
      }),
    ];
    this.connections = new Connections({
      securityGroups,
    });
    const { subnets } = props.vpc.selectSubnets(props.vpcSubnets);
    if (subnets.length === 0) {
      throw new Error(`Did not find any subnets matching '${JSON.stringify(props.vpcSubnets)}', please use a different selection.`);
    }
    const networkInterfaceName = props.networkInterfaceName ?? this.node.path;
    const resource = new CfnNetworkInterface(this, 'Resource', {
      subnetId: subnets[0].subnetId,
      interfaceType: props.interfaceType,
      description: props.description ?? `ENI ${networkInterfaceName}`,
      groupSet: Lazy.list({
        produce: () => this.connections.securityGroups.map(sg => sg.securityGroupId),
      }),
      sourceDestCheck: props.sourceDestCheck,
      ipv4PrefixCount: props.ipv4?._prefixCount,
      ipv4Prefixes: props.ipv4?._prefixes?.map(ipv4Prefix => ({
        ipv4Prefix,
      })),
      privateIpAddress: props.ipv4?._primaryIpAddress,
      privateIpAddresses: props.ipv4?._ipAddresses?.map((privateIpAddress) => ({
        privateIpAddress,
        primary: false,
      })),
      secondaryPrivateIpAddressCount: props.ipv4?._ipAddressCount,
    });
    Tags.of(this).add('Name', networkInterfaceName);
    this.networkInterfaceId = resource.attrId;
  }
}
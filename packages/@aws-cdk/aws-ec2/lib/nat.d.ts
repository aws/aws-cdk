import { Connections, IConnectable } from './connections';
import { InstanceType } from './instance-types';
import { IMachineImage, LookupMachineImage } from './machine-image';
import { ISecurityGroup } from './security-group';
import { PrivateSubnet, PublicSubnet, Vpc } from './vpc';
/**
 * Direction of traffic to allow all by default.
 */
export declare enum NatTrafficDirection {
    /**
     * Allow all outbound traffic and disallow all inbound traffic.
     */
    OUTBOUND_ONLY = "OUTBOUND_ONLY",
    /**
     * Allow all outbound and inbound traffic.
     */
    INBOUND_AND_OUTBOUND = "INBOUND_AND_OUTBOUND",
    /**
     * Disallow all outbound and inbound traffic.
     */
    NONE = "NONE"
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
 *
 *
 */
export declare abstract class NatProvider {
    /**
     * Use NAT Gateways to provide NAT services for your VPC
     *
     * NAT gateways are managed by AWS.
     *
     * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
     */
    static gateway(props?: NatGatewayProps): NatProvider;
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
    static instance(props: NatInstanceProps): NatInstanceProvider;
    /**
     * Return list of gateways spawned by the provider
     */
    abstract readonly configuredGateways: GatewayConfig[];
    /**
     * Called by the VPC to configure NAT
     *
     * Don't call this directly, the VPC will call it automatically.
     */
    abstract configureNat(options: ConfigureNatOptions): void;
    /**
     * Configures subnet with the gateway
     *
     * Don't call this directly, the VPC will call it automatically.
     */
    abstract configureSubnet(subnet: PrivateSubnet): void;
}
/**
 * Options passed by the VPC when NAT needs to be configured
 *
 *
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
}
/**
 * Properties for a NAT instance
 *
 *
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
}
/**
 * NAT provider which uses NAT Instances
 */
export declare class NatInstanceProvider extends NatProvider implements IConnectable {
    private readonly props;
    private gateways;
    private _securityGroup?;
    private _connections?;
    constructor(props: NatInstanceProps);
    configureNat(options: ConfigureNatOptions): void;
    /**
     * The Security Group associated with the NAT instances
     */
    get securityGroup(): ISecurityGroup;
    /**
     * Manage the Security Groups associated with the NAT instances
     */
    get connections(): Connections;
    get configuredGateways(): GatewayConfig[];
    configureSubnet(subnet: PrivateSubnet): void;
}
/**
 * Machine image representing the latest NAT instance image
 *
 *
 */
export declare class NatInstanceImage extends LookupMachineImage {
    constructor();
}

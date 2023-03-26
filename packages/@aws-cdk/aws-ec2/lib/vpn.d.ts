import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { IResource, Resource, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IVpc, SubnetSelection } from './vpc';
export interface IVpnConnection extends IResource {
    /**
     * The id of the VPN connection.
     * @attribute VpnConnectionId
     */
    readonly vpnId: string;
    /**
     * The id of the customer gateway.
     */
    readonly customerGatewayId: string;
    /**
     * The ip address of the customer gateway.
     */
    readonly customerGatewayIp: string;
    /**
     * The ASN of the customer gateway.
     */
    readonly customerGatewayAsn: number;
}
/**
 * The virtual private gateway interface
 */
export interface IVpnGateway extends IResource {
    /**
     * The virtual private gateway Id
     */
    readonly gatewayId: string;
}
export interface VpnTunnelOption {
    /**
     * The pre-shared key (PSK) to establish initial authentication between the
     * virtual private gateway and customer gateway. Allowed characters are
     * alphanumeric characters period `.` and underscores `_`. Must be between 8
     * and 64 characters in length and cannot start with zero (0).
     *
     * @default an Amazon generated pre-shared key
     * @deprecated Use `preSharedKeySecret` instead
     */
    readonly preSharedKey?: string;
    /**
     * The pre-shared key (PSK) to establish initial authentication between the
     * virtual private gateway and customer gateway. Allowed characters are
     * alphanumeric characters period `.` and underscores `_`. Must be between 8
     * and 64 characters in length and cannot start with zero (0).
     *
     * @default an Amazon generated pre-shared key
     */
    readonly preSharedKeySecret?: SecretValue;
    /**
     * The range of inside IP addresses for the tunnel. Any specified CIDR blocks must be
     * unique across all VPN connections that use the same virtual private gateway.
     * A size /30 CIDR block from the 169.254.0.0/16 range.
     *
     * @default an Amazon generated inside IP CIDR
     */
    readonly tunnelInsideCidr?: string;
}
export interface VpnConnectionOptions {
    /**
     * The ip address of the customer gateway.
     */
    readonly ip: string;
    /**
     * The ASN of the customer gateway.
     *
     * @default 65000
     */
    readonly asn?: number;
    /**
     * The static routes to be routed from the VPN gateway to the customer gateway.
     *
     * @default Dynamic routing (BGP)
     */
    readonly staticRoutes?: string[];
    /**
     * The tunnel options for the VPN connection. At most two elements (one per tunnel).
     * Duplicates not allowed.
     *
     * @default Amazon generated tunnel options
     */
    readonly tunnelOptions?: VpnTunnelOption[];
}
/**
 * The VpnGateway Properties
 */
export interface VpnGatewayProps {
    /**
     * Default type ipsec.1
     */
    readonly type: string;
    /**
     * Explicitly specify an Asn or let aws pick an Asn for you.
     * @default 65000
     */
    readonly amazonSideAsn?: number;
}
/**
 * Options for the Vpc.enableVpnGateway() method
 */
export interface EnableVpnGatewayOptions extends VpnGatewayProps {
    /**
     * Provide an array of subnets where the route propagation should be added.
     * @default noPropagation
     */
    readonly vpnRoutePropagation?: SubnetSelection[];
}
export interface VpnConnectionProps extends VpnConnectionOptions {
    /**
     * The VPC to connect to.
     */
    readonly vpc: IVpc;
}
/**
 * The VPN connection type.
 */
export declare enum VpnConnectionType {
    /**
     * The IPsec 1 VPN connection type.
     */
    IPSEC_1 = "ipsec.1",
    /**
     * Dummy member
     * TODO: remove once https://github.com/aws/jsii/issues/231 is fixed
     */
    DUMMY = "dummy"
}
/**
 * The VPN Gateway that shall be added to the VPC
 *
 * @resource AWS::EC2::VPNGateway
 */
export declare class VpnGateway extends Resource implements IVpnGateway {
    /**
     * The virtual private gateway Id
     */
    readonly gatewayId: string;
    constructor(scope: Construct, id: string, props: VpnGatewayProps);
}
/**
 * Attributes of an imported VpnConnection.
 */
export interface VpnConnectionAttributes {
    /**
     * The id of the VPN connection.
     */
    readonly vpnId: string;
    /**
     * The id of the customer gateway.
     */
    readonly customerGatewayId: string;
    /**
     * The ip address of the customer gateway.
     */
    readonly customerGatewayIp: string;
    /**
     * The ASN of the customer gateway.
     */
    readonly customerGatewayAsn: number;
}
/**
 * Base class for Vpn connections.
 */
export declare abstract class VpnConnectionBase extends Resource implements IVpnConnection {
    abstract readonly vpnId: string;
    abstract readonly customerGatewayId: string;
    abstract readonly customerGatewayIp: string;
    abstract readonly customerGatewayAsn: number;
}
/**
 * Define a VPN Connection
 *
 * @resource AWS::EC2::VPNConnection
 */
export declare class VpnConnection extends VpnConnectionBase {
    /**
     * Import a VPN connection by supplying all attributes directly
     */
    static fromVpnConnectionAttributes(scope: Construct, id: string, attrs: VpnConnectionAttributes): IVpnConnection;
    /**
     * Return the given named metric for all VPN connections in the account/region.
     */
    static metricAll(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the tunnel state of all VPN connections in the account/region.
     *
     * @default average over 5 minutes
     */
    static metricAllTunnelState(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the tunnel data in of all VPN connections in the account/region.
     *
     * @default sum over 5 minutes
     */
    static metricAllTunnelDataIn(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the tunnel data out of all VPN connections.
     *
     * @default sum over 5 minutes
     */
    static metricAllTunnelDataOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    readonly vpnId: string;
    readonly customerGatewayId: string;
    readonly customerGatewayIp: string;
    readonly customerGatewayAsn: number;
    constructor(scope: Construct, id: string, props: VpnConnectionProps);
}
export declare const RESERVED_TUNNEL_INSIDE_CIDR: string[];

import { ISamlProvider } from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Resource } from '@aws-cdk/core';
import { Construct, IDependable } from 'constructs';
import { ClientVpnAuthorizationRule, ClientVpnAuthorizationRuleOptions } from './client-vpn-authorization-rule';
import { IClientVpnConnectionHandler, IClientVpnEndpoint, TransportProtocol, VpnPort } from './client-vpn-endpoint-types';
import { ClientVpnRoute, ClientVpnRouteOptions } from './client-vpn-route';
import { Connections } from './connections';
import { ISecurityGroup } from './security-group';
import { IVpc, SubnetSelection } from './vpc';
/**
 * Options for a client VPN endpoint
 */
export interface ClientVpnEndpointOptions {
    /**
     * The IPv4 address range, in CIDR notation, from which to assign client IP
     * addresses. The address range cannot overlap with the local CIDR of the VPC
     * in which the associated subnet is located, or the routes that you add manually.
     *
     * Changing the address range will replace the Client VPN endpoint.
     *
     * The CIDR block should be /22 or greater.
     */
    readonly cidr: string;
    /**
     * The ARN of the client certificate for mutual authentication.
     *
     * The certificate must be signed by a certificate authority (CA) and it must
     * be provisioned in AWS Certificate Manager (ACM).
     *
     * @default - use user-based authentication
     */
    readonly clientCertificateArn?: string;
    /**
     * The type of user-based authentication to use.
     *
     * @see https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/client-authentication.html
     *
     * @default - use mutual authentication
     */
    readonly userBasedAuthentication?: ClientVpnUserBasedAuthentication;
    /**
     * Whether to enable connections logging
     *
     * @default true
     */
    readonly logging?: boolean;
    /**
     * A CloudWatch Logs log group for connection logging
     *
     * @default - a new group is created
     */
    readonly logGroup?: logs.ILogGroup;
    /**
     * A CloudWatch Logs log stream for connection logging
     *
     * @default - a new stream is created
     */
    readonly logStream?: logs.ILogStream;
    /**
     * The AWS Lambda function used for connection authorization
     *
     * The name of the Lambda function must begin with the `AWSClientVPN-` prefix
     *
     * @default - no connection handler
     */
    readonly clientConnectionHandler?: IClientVpnConnectionHandler;
    /**
     * A brief description of the Client VPN endpoint.
     *
     * @default - no description
     */
    readonly description?: string;
    /**
     * The security groups to apply to the target network.
     *
     * @default - a new security group is created
     */
    readonly securityGroups?: ISecurityGroup[];
    /**
     * Specify whether to enable the self-service portal for the Client VPN endpoint.
     *
     * @default true
     */
    readonly selfServicePortal?: boolean;
    /**
     * The ARN of the server certificate
     */
    readonly serverCertificateArn: string;
    /**
     * Indicates whether split-tunnel is enabled on the AWS Client VPN endpoint.
     *
     * @see https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/split-tunnel-vpn.html
     *
     * @default false
     */
    readonly splitTunnel?: boolean;
    /**
     * The transport protocol to be used by the VPN session.
     *
     * @default TransportProtocol.UDP
     */
    readonly transportProtocol?: TransportProtocol;
    /**
     * The port number to assign to the Client VPN endpoint for TCP and UDP
     * traffic.
     *
     * @default VpnPort.HTTPS
     */
    readonly port?: VpnPort;
    /**
     * Information about the DNS servers to be used for DNS resolution.
     *
     * A Client VPN endpoint can have up to two DNS servers.
     *
     * @default - use the DNS address configured on the device
     */
    readonly dnsServers?: string[];
    /**
     * Subnets to associate to the client VPN endpoint.
     *
     * @default - the VPC default strategy
     */
    readonly vpcSubnets?: SubnetSelection;
    /**
     * Whether to authorize all users to the VPC CIDR
     *
     * This automatically creates an authorization rule. Set this to `false` and
     * use `addAuthorizationRule()` to create your own rules instead.
     *
     * @default true
     */
    readonly authorizeAllUsersToVpcCidr?: boolean;
    /**
     * The maximum VPN session duration time.
     *
     * @default ClientVpnSessionTimeout.TWENTY_FOUR_HOURS
     */
    readonly sessionTimeout?: ClientVpnSessionTimeout;
    /**
     * Customizable text that will be displayed in a banner on AWS provided clients
     * when a VPN session is established.
     *
     * UTF-8 encoded characters only. Maximum of 1400 characters.
     *
     * @default - no banner is presented to the client
     */
    readonly clientLoginBanner?: string;
}
/**
 * Maximum VPN session duration time
 */
export declare enum ClientVpnSessionTimeout {
    /** 8 hours */
    EIGHT_HOURS = 8,
    /** 10 hours */
    TEN_HOURS = 10,
    /** 12 hours */
    TWELVE_HOURS = 12,
    /** 24 hours */
    TWENTY_FOUR_HOURS = 24
}
/**
 * User-based authentication for a client VPN endpoint
 */
export declare abstract class ClientVpnUserBasedAuthentication {
    /**
     * Active Directory authentication
     */
    static activeDirectory(directoryId: string): ClientVpnUserBasedAuthentication;
    /** Federated authentication */
    static federated(samlProvider: ISamlProvider, selfServiceSamlProvider?: ISamlProvider): ClientVpnUserBasedAuthentication;
    /** Renders the user based authentication */
    abstract render(): any;
}
/**
 * Properties for a client VPN endpoint
 */
export interface ClientVpnEndpointProps extends ClientVpnEndpointOptions {
    /**
     * The VPC to connect to.
     */
    readonly vpc: IVpc;
}
/**
 * Attributes when importing an existing client VPN endpoint
 */
export interface ClientVpnEndpointAttributes {
    /**
     * The endpoint ID
     */
    readonly endpointId: string;
    /**
     * The security groups associated with the endpoint
     */
    readonly securityGroups: ISecurityGroup[];
}
/**
 * A client VPN connnection
 */
export declare class ClientVpnEndpoint extends Resource implements IClientVpnEndpoint {
    /**
     * Import an existing client VPN endpoint
     */
    static fromEndpointAttributes(scope: Construct, id: string, attrs: ClientVpnEndpointAttributes): IClientVpnEndpoint;
    readonly endpointId: string;
    /**
     * Allows specify security group connections for the endpoint.
     */
    readonly connections: Connections;
    readonly targetNetworksAssociated: IDependable;
    private readonly _targetNetworksAssociated;
    constructor(scope: Construct, id: string, props: ClientVpnEndpointProps);
    /**
     * Adds an authorization rule to this endpoint
     */
    addAuthorizationRule(id: string, props: ClientVpnAuthorizationRuleOptions): ClientVpnAuthorizationRule;
    /**
     * Adds a route to this endpoint
     */
    addRoute(id: string, props: ClientVpnRouteOptions): ClientVpnRoute;
}

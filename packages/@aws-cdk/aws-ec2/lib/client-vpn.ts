import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/core');
import {
  CfnClientVpnAuthorizationRule,
  CfnClientVpnEndpoint,
  CfnClientVpnRoute,
  CfnClientVpnTargetNetworkAssociation
} from './ec2.generated';
import {CIDR_VALIDATION_REGEXES} from "./peer";
import {ISubnet} from './vpc';

interface IClientAuthenticationRequestOptions {
  /**
   * Information about the Active Directory to be used
   */
  readonly activeDirectory?: {
    /**
     * The ID of the Active Directory to be used for authentication
     */
    directoryId: string
  };
  /**
   * Information about the authentication certificates to be used
   */
  readonly mutualAuthentication?: {
    /**
     * The ARN of the client certificate
     */
    clientRootCertificateChainArn: string
  };
  /**
   * The type of client authentication to be used.
   * Specify {@link ClientRequestAuthenticationType.CERTIFICATE} to use certificate-based authentication,
   * or {@link ClientRequestAuthenticationType.DIRECTORY_SERVICE} to use Active Directory authentication.
   */
  readonly type: ClientRequestAuthenticationType;
}

/**
 * Authentication method to be used by a Client VPN endpoint
 */
export class ClientAuthenticationRequest {
  /**
   * Active Directory authentication
   *
   * @param directoryId The ID of the Active Directory to be used for authentication
   */
  public static activeDirectory(directoryId: string): ClientAuthenticationRequest {
    return new ClientAuthenticationRequest({
      activeDirectory: {directoryId},
      type: ClientRequestAuthenticationType.DIRECTORY_SERVICE
    });
  }

  // TODO replace with acm.Certificate?
  /**
   * Certificate-based authentication
   *
   * @param clientRootCertificateChainArn The ARN of the client certificate.
   * The certificate must be signed by a certificate authority (CA)
   * and it must be provisioned in AWS Certificate Manager (ACM).
   */
  public static mutualAuthentication(clientRootCertificateChainArn: string): ClientAuthenticationRequest {
    return new ClientAuthenticationRequest({
      mutualAuthentication: {clientRootCertificateChainArn},
      type: ClientRequestAuthenticationType.CERTIFICATE
    });
  }

  private constructor(public readonly options: IClientAuthenticationRequestOptions) {
  }
}

interface IConnectionLogOptions {
  /**
   * The name of the CloudWatch Logs log group
   */
  readonly cloudwatchLogGroup?: string;
  /**
   * The name of the CloudWatch Logs log stream to which the connection data is published
   */
  readonly cloudwatchLogStream?: string;
  /**
   * Indicates whether connection logging is enabled
   */
  readonly enabled: boolean;
}

/**
 * Client connection logging options for the Client VPN endpoint.
 * If enabled, data about client connections is sent to a Cloudwatch Logs log stream.
 *
 * The following information is logged:
 * * Client connection requests
 * * Client connection results (successful and unsuccessful)
 * * Reasons for unsuccessful client connection requests
 * * Client connection termination time
 */
export class ConnectionLog {
  /**
   * Log client connection information into a CloudWatch log group
   *
   * @param group CloudWatch log group
   * @param enabled Whether connection logging is enabled
   */
  public static group(group: logs.ILogGroup, enabled = true): ConnectionLog {
    return new ConnectionLog({cloudwatchLogGroup: group.logGroupName, enabled});
  }

  /**
   * Log client connection information into a CloudWatch log stream
   *
   * @param stream CloudWatch log stream
   * @param enabled Whether connection logging is enabled
   */
  public static stream(stream: logs.ILogStream, enabled = true): ConnectionLog {
    return new ConnectionLog({cloudwatchLogStream: stream.logStreamName, enabled});
  }

  private constructor(public readonly options: IConnectionLogOptions) {
  }
}

export interface ITagSpecificationTag {
  readonly key: string;
  readonly value: string;
}

export interface ITagSpecification {
  readonly resourceType: TagSpecificationResourceType;
  readonly tags: ITagSpecificationTag[];
}

export interface ClientVpnEndpointProps {
  /**
   * Information about the authentication method to be used to authenticate clients
   */
  readonly authenticationOptions: ClientAuthenticationRequest[];

  /**
   * The IPv4 address range, in CIDR notation, from which to assign client IP addresses
   * The address range cannot overlap with the local CIDR of the VPC in which the associated subnet is located,
   * or the routes that you add manually.
   * The address range cannot be changed after the Client VPN endpoint has been created.
   * The CIDR block should be /22 or greater.
   */
  readonly clientCidrBlock: string;
  /**
   * Information about the client connection logging options
   */
  readonly connectionLog: ConnectionLog;
  // TODO replace with acm.Certificate?
  /**
   * The ARN of the server certificate
   */
  readonly serverCertificateArn: string;
  /**
   * A brief description of the Client VPN endpoint
   */
  readonly description?: string;
  /**
   * Information about the DNS servers to be used for DNS resolution.
   * A Client VPN endpoint can have up to two DNS servers.
   * If no DNS server is specified, the DNS address configured on the device is used for the DNS server.
   */
  readonly dnsServers?: string[];
  /**
   * Indicates whether split-tunnel is enabled on the AWS Client VPN endpoint
   *
   * @default false
   * @see [Split-Tunnel on AWS Client VPN Endpoints]{@link https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/split-tunnel-vpn.html}
   */
  readonly splitTunnel?: boolean;
  /**
   * The tags to apply to the Client VPN endpoint during creation
   */
  readonly tagsSpecifications?: ITagSpecification[];
  /**
   * The transport protocol to be used by the VPN session
   *
   * @default ClientVpnEndpointProtocol.UDP
   */
  readonly transportProtocol?: ClientVpnEndpointProtocol;
}

export interface IClientVpnEndpoint extends cdk.IResource {
  /**
   * The id of the Client VPN Endpoint
   */
  readonly clientVpnEndpointId: string;
  readonly routes: ClientVpnRoute[];
  readonly targetNetworkAssociations: ClientVpnRoute[];
  readonly authorizationRules: ClientVpnRoute[];
}

/**
 * Define a Client VPN Endpoint
 *
 * A Client VPN endpoint is the resource you create and configure to enable and manage client VPN sessions.
 * It is the destination endpoint at which all client VPN sessions are terminated.
 *
 * @resource AWS::EC2::ClientVpnEndpoint
 */
export class ClientVpnEndpoint extends cdk.Resource implements IClientVpnEndpoint {

  public readonly clientVpnEndpointId: string;
  public readonly routes: ClientVpnRoute[] = [];
  public readonly targetNetworkAssociations: ClientVpnRoute[] = [];
  public readonly authorizationRules: ClientVpnRoute[] = [];

  constructor(scope: cdk.Construct, id: string, props: ClientVpnEndpointProps) {
    super(scope, id);

    if (!cdk.Token.isUnresolved(props.clientCidrBlock)) {
      const cidrMatch = props.clientCidrBlock.match(CIDR_VALIDATION_REGEXES.ipv4);

      if (!cidrMatch) {
        throw new Error(`Invalid IPv4 CIDR: "${props.clientCidrBlock}"`);
      }

      if (!cidrMatch[2] || Number(cidrMatch[2]) < 22) {
        throw new Error(`CIDR mask should be 22 or greater (got "${cidrMatch[2]}")`);
      }
    }

    if (props.dnsServers && !cdk.Token.isUnresolved(props.dnsServers) && props.dnsServers.length > 2) {
      throw new Error(`A Client VPN endpoint cannot have more than 2 DNS servers, got ${props.dnsServers.length}`);
    }

    const clientVpnEndpoint = new CfnClientVpnEndpoint(this, 'Resource', {
      authenticationOptions: props.authenticationOptions.map(({options}) => options),
      connectionLogOptions: props.connectionLog && props.connectionLog.options,
      serverCertificateArn: props.serverCertificateArn,
      clientCidrBlock: props.clientCidrBlock,
      description: props.description,
      splitTunnel: props.splitTunnel,
      tagSpecifications: props.tagsSpecifications,
      dnsServers: props.dnsServers,
      transportProtocol: props.transportProtocol,
    });

    this.clientVpnEndpointId = clientVpnEndpoint.ref;
  }

  public addRoute(options: ClientVpnRouteOptions): ClientVpnRoute {
    const route = new ClientVpnRoute(this, `Route-${this.routes.length}`, {
      clientVpnEndpoint: this,
      ...options,
    });

    this.routes.push(route);
    return route;
  }

  public addTargetNetworkAssociation(subnet: ISubnet): ClientVpnTargetNetworkAssociation {
    const association = new ClientVpnTargetNetworkAssociation(
      this,
      `TargetNetworkAssociation-${this.targetNetworkAssociations.length}`, {
        clientVpnEndpoint: this,
        subnet,
      });

    this.targetNetworkAssociations.push(association);
    return association;
  }

  public addAuthorizationRule(options: ClientVpnAuthorizationRuleOptions): ClientVpnAuthorizationRule {
    const rule = new ClientVpnAuthorizationRule(this, `AuthorizationRule-${this.authorizationRules.length}`, {
      clientVpnEndpoint: this,
      ...options,
    });

    this.authorizationRules.push(rule);
    return rule;
  }
}

export interface ClientVpnRouteOptions {
  readonly description?: string;
  readonly destinationCidrBlock: string;
  readonly targetSubnet: ISubnet;
}

export interface ClientVpnRouteProps extends ClientVpnRouteOptions {
  readonly clientVpnEndpoint: IClientVpnEndpoint;
}

/**
 * Define a Client VPN Route
 *
 * @resource AWS::EC2::ClientVpnRoute
 */
export class ClientVpnRoute extends cdk.Resource {
  constructor(scope: cdk.Construct, id: string, props: ClientVpnRouteProps) {
    super(scope, id);

    new CfnClientVpnRoute(this, 'Resource', {
      clientVpnEndpointId: props.clientVpnEndpoint.clientVpnEndpointId,
      description: props.description,
      destinationCidrBlock: props.destinationCidrBlock,
      targetVpcSubnetId: props.targetSubnet.subnetId,
    });

    props.clientVpnEndpoint.routes.push(this);
  }
}

export interface ClientVpnTargetNetworkAssociationOptions {
  readonly subnet: ISubnet;
}

export interface ClientVpnTargetNetworkAssociationProps extends ClientVpnTargetNetworkAssociationOptions {
  readonly clientVpnEndpoint: IClientVpnEndpoint;
}

/**
 * Define a Client VPN Target Network Association
 *
 * @resource AWS::EC2::ClientVpnTargetNetworkAssociation
 */
export class ClientVpnTargetNetworkAssociation extends cdk.Resource {
  constructor(scope: cdk.Construct, id: string, props: ClientVpnTargetNetworkAssociationProps) {
    super(scope, id);

    new CfnClientVpnTargetNetworkAssociation(this, 'Resource', {
      clientVpnEndpointId: props.clientVpnEndpoint.clientVpnEndpointId,
      subnetId: props.subnet.subnetId,
    });

    props.clientVpnEndpoint.targetNetworkAssociations.push(this);
  }
}

export interface ClientVpnAuthorizationRuleOptions {
  readonly targetNetworkCidr: string;
  readonly accessGroupId?: string;
  readonly authorizeAllGroups?: boolean;
  readonly description?: string;
}

export interface ClientVpnAuthorizationRuleProps extends ClientVpnAuthorizationRuleOptions {
  readonly clientVpnEndpoint: IClientVpnEndpoint;
}

/**
 * Define a Client VPN Target Network Association
 *
 * @resource AWS::EC2::ClientVpnAuthorizationRule
 */
export class ClientVpnAuthorizationRule extends cdk.Resource {
  constructor(scope: cdk.Construct, id: string, props: ClientVpnAuthorizationRuleProps) {
    super(scope, id);

    new CfnClientVpnAuthorizationRule(this, 'Resource', {
      clientVpnEndpointId: props.clientVpnEndpoint.clientVpnEndpointId,
      targetNetworkCidr: props.targetNetworkCidr,
      accessGroupId: props.accessGroupId,
      authorizeAllGroups: props.authorizeAllGroups,
      description: props.description,
    });

    props.clientVpnEndpoint.authorizationRules.push(this);
  }
}

export enum ClientVpnEndpointProtocol {
  TCP = 'tcp',
  UDP = 'udp',
}

export enum ClientRequestAuthenticationType {
  CERTIFICATE = 'certificate-authentication',
  DIRECTORY_SERVICE = 'directory-service-authentication',
}

export enum TagSpecificationResourceType {
  CLIENT_VPN_ENDPOINT = 'client-vpn-endpoint',
  CUSTOMER_GATEWAY = 'customer-gateway',
  DEDICATED_HOST = 'dedicated-host',
  DHCP_OPTIONS = 'dhcp-options',
  ELASTIC_IP = 'elastic-ip',
  FLEET = 'fleet',
  FPGA_IMAGE = 'fpga-image',
  HOST_RESERVATION = 'host-reservation',
  IMAGE = 'image',
  INSTANCE = 'instance',
  INTERNET_GATEWAY = 'internet-gateway',
  LAUNCH_TEMPLATE = 'launch-template',
  NATGATEWAY = 'natgateway',
  NETWORK_ACL = 'network-acl',
  NETWORK_INTERFACE = 'network-interface',
  RESERVED_INSTANCES = 'reserved-instances',
  ROUTE_TABLE = 'route-table',
  SECURITY_GROUP = 'security-group',
  SNAPSHOT = 'snapshot',
  SPOT_INSTANCES_REQUEST = 'spot-instances-request',
  SUBNET = 'subnet',
  TRAFFIC_MIRROR_FILTER = 'traffic-mirror-filter',
  TRAFFIC_MIRROR_SESSION = 'traffic-mirror-session',
  TRAFFIC_MIRROR_TARGET = 'traffic-mirror-target',
  TRANSIT_GATEWAY = 'transit-gateway',
  TRANSIT_GATEWAY_ATTACHMENT = 'transit-gateway-attachment',
  TRANSIT_GATEWAY_ROUTE_TABLE = 'transit-gateway-route-table',
  VOLUME = 'volume',
  VPC = 'vpc',
  VPC_PEERING_CONNECTION = 'vpc-peering-connection',
  VPN_CONNECTION = 'vpn-connection',
  VPN_GATEWA = 'vpn-gatewa',
}

import cdk = require('@aws-cdk/core');
import {
  CfnClientVpnAuthorizationRule,
  CfnClientVpnEndpoint,
  CfnClientVpnRoute,
  CfnClientVpnTargetNetworkAssociation
} from './ec2.generated';
import {ISubnet} from './vpc';

export interface IClientVpnEndpoint extends cdk.IResource {
  /**
   * The id of the Client VPN Endpoint
   */
  readonly clientVpnEndpointId: string;
}

// TODO helper class if activeDirectory and mutualAuthentication mutually exclusive?
export interface IClientAuthenticationRequest {
  readonly activeDirectoryId?: string;
  readonly mutualAuthenticationClientRootCertificateChainArn?: string;
  readonly type: ClientRequestAuthenticationType;
}

export interface IConnectionLogOptions {
  // TODO replace with cloudwatch object?
  readonly cloudwatchLogGroup?: string;
  readonly cloudwatchLogStream?: string;
  readonly enabled: boolean;
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
  readonly authenticationOptions: IClientAuthenticationRequest[];
  readonly clientCidrBlock: string;
  readonly connectionLogOptions: IConnectionLogOptions;
  // TODO replace with serverCertificate object?
  readonly serverCertificateArn: string;
  readonly description?: string;
  readonly dnsServers?: string[];
  readonly splitTunnel: boolean;
  readonly tagsSpecifications?: ITagSpecification[];
  readonly transportProtocol: ClientVpnEndpointProtocol;
}

/**
 * Define a Client VPN Endpoint
 *
 * @resource AWS::EC2::ClientVpnEndpoint
 */
export class ClientVpnEndpoint extends cdk.Resource implements IClientVpnEndpoint {

  public readonly clientVpnEndpointId: string;

  constructor(scope: cdk.Construct, id: string, props: ClientVpnEndpointProps) {
    super(scope, id);

    const clientVpnEndpoint = new CfnClientVpnEndpoint(this, 'Resource', {
      authenticationOptions: props.authenticationOptions.map(
        ({activeDirectoryId, mutualAuthenticationClientRootCertificateChainArn, type}) => ({
          activeDirectory: activeDirectoryId ? {directoryId: activeDirectoryId} : undefined,
          mutualAuthentication: mutualAuthenticationClientRootCertificateChainArn ?
            {clientRootCertificateChainArn: mutualAuthenticationClientRootCertificateChainArn} :
            undefined,
          type,
        })),
      connectionLogOptions: props.connectionLogOptions,
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

  public addRoute(scope: cdk.Construct, id: string, options: ClientVpnRouteOptions): ClientVpnRoute {
    return new ClientVpnRoute(scope, id, {
      clientVpnEndpoint: this,
      ...options,
    });
  }

  public addTargetNetworkAssociation(scope: cdk.Construct, id: string, subnet: ISubnet): ClientVpnTargetNetworkAssociation {
    return new ClientVpnTargetNetworkAssociation(scope, id, {
      clientVpnEndpoint: this,
      subnet,
    });
  }

  public addAuthorizationRule(scope: cdk.Construct, id: string, options: ClientVpnAuthorizationRuleOptions): ClientVpnAuthorizationRule {
    return new ClientVpnAuthorizationRule(scope, id, {
      clientVpnEndpoint: this,
      ...options,
    });
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

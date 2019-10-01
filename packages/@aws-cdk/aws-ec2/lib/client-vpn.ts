import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/core');
import {
  CfnClientVpnAuthorizationRule,
  CfnClientVpnEndpoint,
  CfnClientVpnRoute,
  CfnClientVpnTargetNetworkAssociation
} from './ec2.generated';
import {CIDR_VALIDATION_REGEXES} from "./peer";
import {SecurityGroup} from './security-group';
import {ISubnet, SubnetSelection, Vpc} from './vpc';

/**
 * Configuration for the authentication method to be used
 *
 * @see ClientAuthenticationRequest
 */
interface ClientAuthenticationRequestConfig {
  /**
   * Information about the Active Directory to be used
   *
   * @default - none
   */
  readonly activeDirectory?: CfnClientVpnEndpoint.DirectoryServiceAuthenticationRequestProperty;
  /**
   * Information about the authentication certificates to be used
   *
   * @default - none
   */
  readonly mutualAuthentication?: CfnClientVpnEndpoint.CertificateAuthenticationRequestProperty;
  /**
   * The type of client authentication to be used.
   * Specify {@link ClientRequestAuthenticationType.CERTIFICATE} to use certificate-based authentication,
   * or {@link ClientRequestAuthenticationType.DIRECTORY_SERVICE} to use Active Directory authentication.
   */
  readonly type: ClientRequestAuthenticationType;
}

/**
 * Authentication method to be used by a Client VPN endpoint
 *
 * @experimental
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

  private constructor(public readonly options: ClientAuthenticationRequestConfig) {
  }
}

/**
 * Configuration for connection logging options
 *
 * @see ConnectionLog
 */
interface ConnectionLogConfig {
  /**
   * The name of the CloudWatch Logs log group
   *
   * @default - none
   */
  readonly cloudwatchLogGroup?: string;
  /**
   * The name of the CloudWatch Logs log stream to which the connection data is published
   *
   * @default - none
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
 *
 * @experimental
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

  private constructor(public readonly options: ConnectionLogConfig) {
  }
}

/**
 * Configuration for Client VPN Endpoint
 *
 * @see ClientVpnEndpoint
 * @experimental
 */
export interface ClientVpnEndpointProps {
  /**
   * The VPC in which to create your Client Vpn.
   */
  readonly vpc: Vpc;

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
   *
   * @default - Creates a new {@link LogGroup}
   */
  readonly connectionLog?: ConnectionLog;

  // TODO replace with acm.Certificate?
  /**
   * The ARN of the server certificate
   */
  readonly serverCertificateArn: string;

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
   * The transport protocol to be used by the VPN session
   *
   * @default ClientVpnEndpointProtocol.UDP
   */
  readonly transportProtocol?: ClientVpnEndpointProtocol;

  /**
   * A brief description of the Client VPN endpoint
   */
  readonly description?: string;

  /**
   * VPN Routes
   */
  readonly routes?: ClientVpnRouteOptions[];

  /**
   * Target Network Association
   */
  readonly targetNetworkAssociations?: SubnetSelection[];

  /**
   * Authorization Rules
   */
  readonly authorizationRules?: ClientVpnAuthorizationRuleOptions[];
}

/**
 * ClientVpnEndpoint based classes MUST implement
 *
 * @experimental
 */
export interface IClientVpnEndpoint extends cdk.IResource {
  /**
   * The id of the Client VPN Endpoint
   */
  readonly clientVpnEndpointId: string;
}

/**
 * Define a Client VPN Endpoint
 *
 * A Client VPN endpoint is the resource you create and configure to enable and manage client VPN sessions.
 * It is the destination endpoint at which all client VPN sessions are terminated.
 *
 * @resource AWS::EC2::ClientVpnEndpoint
 * @experimental
 */
export class ClientVpnEndpoint extends cdk.Resource implements IClientVpnEndpoint {

  public readonly clientVpnEndpointId: string;
  public readonly vpc: Vpc;
  public readonly securityGroup: SecurityGroup;

  private routeCount = 0;
  private targetNetworkAssociationCount = 0;
  private authorizationRuleCount = 0;

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
      connectionLogOptions: (props.connectionLog ? props.connectionLog : ConnectionLog.group(new logs.LogGroup(scope, 'Log'))).options,
      serverCertificateArn: props.serverCertificateArn,
      clientCidrBlock: props.clientCidrBlock,
      description: props.description,
      splitTunnel: props.splitTunnel,
      dnsServers: props.dnsServers,
      transportProtocol: props.transportProtocol,
    });

    this.clientVpnEndpointId = clientVpnEndpoint.ref;

    this.vpc = props.vpc;
    this.securityGroup = new SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      allowAllOutbound: false,
    });

    // TODO Replace with https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/199
    // TODO
    /*new cloudformation.AwsCustomResource(this, 'ApplySecurityGroupsToClientVpnTargetNetwork', {
      onUpdate: {
        service: 'EC2',
        action: 'applySecurityGroupsToClientVpnTargetNetwork',
        parameters: {
          ClientVpnEndpointId: clientVpnEndpoint.ref,
          VpcId: props.vpc.vpcId,
          SecurityGroupIds: [this.securityGroup.securityGroupId],
        },
        physicalResourceId: this.securityGroup.securityGroupId,
      },
    });*/

    if (props.routes) {
      props.routes.map((options) => this.addRoute(options));
    }

    if (props.targetNetworkAssociations) {
      props.targetNetworkAssociations.map((options) =>
        this.addTargetNetworkAssociations(options)
      );
    }

    if (props.authorizationRules) {
      props.authorizationRules.map((options) =>
        this.addAuthorizationRule(options)
      );
    }
  }

  public addRoute(options: ClientVpnRouteOptions): ClientVpnRoute {
    return new ClientVpnRoute(this, `Route-${++this.routeCount}`, {
      clientVpnEndpoint: this,
      ...options,
    });
  }

  /**
   * Each subnet must belong to a different Availability Zone.
   *
   * @param subnetSelection
   */
  public addTargetNetworkAssociations(subnetSelection: SubnetSelection): ClientVpnTargetNetworkAssociation[] {
    // TODO check "Each subnet must belong to a different Availability Zone."
    const {subnets} = this.vpc.selectSubnets(subnetSelection);

    return subnets.map((subnet) =>
      new ClientVpnTargetNetworkAssociation(
        this,
        `TargetNetworkAssociation-${++this.targetNetworkAssociationCount}`, {
          clientVpnEndpoint: this,
          subnet,
        })
    );
  }

  public addAuthorizationRule(options: ClientVpnAuthorizationRuleOptions): ClientVpnAuthorizationRule {
    return new ClientVpnAuthorizationRule(this, `AuthorizationRule-${++this.authorizationRuleCount}`, {
      clientVpnEndpoint: this,
      ...options,
    });
  }
}

/**
 * Configuration for Client VPN Route
 *
 * @see ClientVpnRoute
 * @experimental
 */
export interface ClientVpnRouteOptions {
  /**
   * The IPv4 address range, in CIDR notation, of the route destination.
   *
   * @example
   * * To add a route for Internet access, enter 0.0.0.0/0
   * * To add a route for a peered VPC, enter the peered VPC's IPv4 CIDR range
   * * To add a route for an on-premises network, enter the AWS Site-to-Site VPN connection's IPv4 CIDR range
   * * Route address ranges cannot overlap with the CIDR range specified for client allocation.
   */
  readonly destinationCidrBlock: string;

  // FIXME Also change to SubnetSelection?
  /**
   * The subnet through which you want to route traffic
   *
   * The specified subnet must be an existing target network of the Client VPN endpoint.
   */
  readonly targetSubnet: ISubnet;
  /**
   * A brief description of the route.
   */
  readonly description?: string;
}

/**
 * Configuration for Client VPN Route
 *
 * @see ClientVpnRoute
 * @experimental
 */
export interface ClientVpnRouteProps extends ClientVpnRouteOptions {
  /**
   * The Client VPN endpont to associate the subnet with
   */
  readonly clientVpnEndpoint: IClientVpnEndpoint;
}

/**
 * Define a Client VPN Route
 *
 * @resource AWS::EC2::ClientVpnRoute
 * @experimental
 */
export class ClientVpnRoute extends cdk.Resource {
  constructor(scope: cdk.Construct, id: string, props: ClientVpnRouteProps) {
    super(scope, id);

    if (!cdk.Token.isUnresolved(props.destinationCidrBlock)) {
      const cidrMatch = props.destinationCidrBlock.match(CIDR_VALIDATION_REGEXES.ipv4);

      if (!cidrMatch) {
        throw new Error(`Invalid IPv4 CIDR: "${props.destinationCidrBlock}"`);
      }
    }

    new CfnClientVpnRoute(this, 'Resource', {
      clientVpnEndpointId: props.clientVpnEndpoint.clientVpnEndpointId,
      description: props.description,
      destinationCidrBlock: props.destinationCidrBlock,
      targetVpcSubnetId: props.targetSubnet.subnetId,
    });
  }
}

/**
 * Configuration for Client VPN Target Network Association
 *
 * @see ClientVpnTargetNetworkAssociation
 * @experimental
 */
export interface ClientVpnTargetNetworkAssociationOptions {
  // FIXME Also change to SubnetSelection?
  // FIXME It would be weird for ClientVpnTargetNetworkAssociation to return multiple associations
  // FIXME But it could be doable with a static constructor
  /**
   * Subnet to associate with the Client VPN endpoint
   */
  readonly subnet: ISubnet;
}

/**
 * Configuration for Client VPN Target Network Association
 *
 * @see ClientVpnTargetNetworkAssociation
 * @experimental
 */
export interface ClientVpnTargetNetworkAssociationProps extends ClientVpnTargetNetworkAssociationOptions {
  /**
   * The Client VPN endpont to associate the subnet with
   */
  readonly clientVpnEndpoint: IClientVpnEndpoint;
}

/**
 * Define a Client VPN Target Network Association
 *
 * @resource AWS::EC2::ClientVpnTargetNetworkAssociation
 * @experimental
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

/**
 * Configuration for Client VPN Authorization Rule
 *
 * @see ClientVpnAuthorizationRule
 * @experimental
 */
export interface ClientVpnAuthorizationRuleOptions {
  /**
   * The IPv4 address range, in CIDR notation, of the network for which access is being authorized
   */
  readonly targetNetworkCidr: string;
  /**
   * The ID of the Active Directory group to grant access
   */
  readonly accessGroupId?: string;
  /**
   * Indicates whether to grant access to all clients
   * If true, grants all clients who successfully establish a VPN connection access to the network.
   */
  readonly authorizeAllGroups?: boolean;
  /**
   * A brief description of the authorization rule
   */
  readonly description?: string;
}

/**
 * Configuration for Client VPN Authorization Rule
 *
 * @see ClientVpnAuthorizationRule
 * @experimental
 */
export interface ClientVpnAuthorizationRuleProps extends ClientVpnAuthorizationRuleOptions {
  /**
   * The Client VPN endpont to attach the authorization rule to
   */
  readonly clientVpnEndpoint: IClientVpnEndpoint;
}

/**
 * Define a Client VPN Target Network Association
 *
 * @resource AWS::EC2::ClientVpnAuthorizationRule
 * @experimental
 */
export class ClientVpnAuthorizationRule extends cdk.Resource {
  constructor(scope: cdk.Construct, id: string, props: ClientVpnAuthorizationRuleProps) {
    super(scope, id);

    if (!cdk.Token.isUnresolved(props.targetNetworkCidr)) {
      const cidrMatch = props.targetNetworkCidr.match(CIDR_VALIDATION_REGEXES.ipv4);

      if (!cidrMatch) {
        throw new Error(`Invalid IPv4 CIDR: "${props.targetNetworkCidr}"`);
      }
    }

    new CfnClientVpnAuthorizationRule(this, 'Resource', {
      clientVpnEndpointId: props.clientVpnEndpoint.clientVpnEndpointId,
      targetNetworkCidr: props.targetNetworkCidr,
      accessGroupId: props.accessGroupId,
      authorizeAllGroups: props.authorizeAllGroups,
      description: props.description,
    });
  }
}

/**
 * The supported transport protocols used by VPN sessions
 */
export enum ClientVpnEndpointProtocol {
  /**
   * TCP
   */
  TCP = 'tcp',
  /**
   * UDP
   */
  UDP = 'udp',
}

/**
 * Supported types of client authentication
 */
enum ClientRequestAuthenticationType {
  /**
   * Certificate-based authentication
   */
  CERTIFICATE = 'certificate-authentication',

  /**
   * Active Directory authentication
   */
  DIRECTORY_SERVICE = 'directory-service-authentication',
}

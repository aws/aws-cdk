import { Construct, DependencyGroup, IDependable } from 'constructs';
import { ClientVpnAuthorizationRule, ClientVpnAuthorizationRuleOptions } from './client-vpn-authorization-rule';
import {
  IClientVpnConnectionHandler,
  IClientVpnEndpoint,
  TransportProtocol,
  VpnPort,
} from './client-vpn-endpoint-types';
import { ClientVpnRoute, ClientVpnRouteOptions } from './client-vpn-route';
import { Connections } from './connections';
import {
  CfnClientVpnEndpoint,
  CfnClientVpnTargetNetworkAssociation,
  ClientVpnEndpointReference,
} from './ec2.generated';
import { CidrBlock } from './network-util';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { IVpc, SubnetSelection } from './vpc';
import { ISAMLProviderRef } from '../../aws-iam';
import * as logs from '../../aws-logs';
import { CfnOutput, Resource, Token, UnscopedValidationError, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Options for Client Route Enforcement
 */
export interface ClientRouteEnforcementOptions {
  /**
   * Enable or disable Client Route Enforcement.
   * The state can either be true (enabled) or false (disabled).
   */
  readonly enforced: boolean;
}

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

  /**
   * Options for Client Route Enforcement.
   *
   * Client Route Enforcement is a feature of Client VPN that helps enforce administrator defined routes on devices connected through the VPN.
   * This feature helps improve your security posture by ensuring that network traffic originating from a connected client is not inadvertently sent outside the VPN tunnel.
   *
   * @see https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/cvpn-working-cre.html
   *
   * @default undefined - AWS Client VPN default setting is disable client route enforcement
   */
  readonly clientRouteEnforcementOptions?: ClientRouteEnforcementOptions;
}

/**
 * Maximum VPN session duration time
 */
export enum ClientVpnSessionTimeout {
  /** 8 hours */
  EIGHT_HOURS = 8,
  /** 10 hours */
  TEN_HOURS = 10,
  /** 12 hours */
  TWELVE_HOURS = 12,
  /** 24 hours */
  TWENTY_FOUR_HOURS = 24,
}

/**
 * User-based authentication for a client VPN endpoint
 */
export abstract class ClientVpnUserBasedAuthentication {
  /**
   * Active Directory authentication
   */
  public static activeDirectory(directoryId: string): ClientVpnUserBasedAuthentication {
    return new ActiveDirectoryAuthentication(directoryId);
  }

  /** Federated authentication */
  public static federated(samlProvider: ISAMLProviderRef, selfServiceSamlProvider?: ISAMLProviderRef): ClientVpnUserBasedAuthentication {
    return new FederatedAuthentication(samlProvider, selfServiceSamlProvider);
  }

  /** Renders the user based authentication */
  public abstract render(): any;
}

/**
 * Active Directory authentication
 */
class ActiveDirectoryAuthentication extends ClientVpnUserBasedAuthentication {
  constructor(private readonly directoryId: string) {
    super();
  }

  render(): any {
    return {
      type: 'directory-service-authentication',
      activeDirectory: { directoryId: this.directoryId },
    };
  }
}

/**
 * Federated authentication
 */
class FederatedAuthentication extends ClientVpnUserBasedAuthentication {
  constructor(private readonly samlProvider: ISAMLProviderRef, private readonly selfServiceSamlProvider?: ISAMLProviderRef) {
    super();
  }

  render(): any {
    return {
      type: 'federated-authentication',
      federatedAuthentication: {
        samlProviderArn: this.samlProvider.samlProviderRef.samlProviderArn,
        selfServiceSamlProviderArn: this.selfServiceSamlProvider?.samlProviderRef.samlProviderArn,
      },
    };
  }
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
 * A client VPN connection
 */
@propertyInjectable
export class ClientVpnEndpoint extends Resource implements IClientVpnEndpoint {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ec2.ClientVpnEndpoint';

  /**
   * Import an existing client VPN endpoint
   */
  public static fromEndpointAttributes(scope: Construct, id: string, attrs: ClientVpnEndpointAttributes): IClientVpnEndpoint {
    class Import extends Resource implements IClientVpnEndpoint {
      public readonly endpointId = attrs.endpointId;
      public readonly connections = new Connections({ securityGroups: attrs.securityGroups });
      public readonly targetNetworksAssociated: IDependable = new DependencyGroup();

      public get clientVpnEndpointRef(): ClientVpnEndpointReference {
        return {
          clientVpnEndpointId: this.endpointId,
        };
      }
    }
    return new Import(scope, id);
  }

  public readonly endpointId: string;

  /**
   * Allows specify security group connections for the endpoint.
   */
  public readonly connections: Connections;

  public readonly targetNetworksAssociated: IDependable;

  private readonly _targetNetworksAssociated = new DependencyGroup();

  constructor(scope: Construct, id: string, props: ClientVpnEndpointProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (!Token.isUnresolved(props.vpc.vpcCidrBlock)) {
      const clientCidr = new CidrBlock(props.cidr);
      const vpcCidr = new CidrBlock(props.vpc.vpcCidrBlock);
      if (vpcCidr.containsCidr(clientCidr)) {
        throw new ValidationError('The client CIDR cannot overlap with the local CIDR of the VPC', this);
      }
    }

    if (props.dnsServers && props.dnsServers.length > 2) {
      throw new ValidationError('A client VPN endpoint can have up to two DNS servers', this);
    }

    if (props.logging == false && (props.logGroup || props.logStream)) {
      throw new ValidationError('Cannot specify `logGroup` or `logStream` when logging is disabled', this);
    }

    if (props.clientConnectionHandler
      && !Token.isUnresolved(props.clientConnectionHandler.functionName)
      && !props.clientConnectionHandler.functionName.startsWith('AWSClientVPN-')) {
      throw new ValidationError('The name of the Lambda function must begin with the `AWSClientVPN-` prefix', this);
    }

    if (props.clientLoginBanner
      && !Token.isUnresolved(props.clientLoginBanner)
      && props.clientLoginBanner.length > 1400) {
      throw new ValidationError(`The maximum length for the client login banner is 1400, got ${props.clientLoginBanner.length}`, this);
    }

    if (props.clientRouteEnforcementOptions?.enforced && props.splitTunnel) {
      throw new ValidationError(
        'Client Route Enforcement cannot be enabled when splitTunnel is true.',
        this,
      );
    }

    const logging = props.logging ?? true;
    const logGroup = logging
      ? props.logGroup ?? new logs.LogGroup(this, 'LogGroup')
      : undefined;

    const securityGroups = props.securityGroups ?? [new SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
    })];
    this.connections = new Connections({ securityGroups });

    const endpoint = new CfnClientVpnEndpoint(this, 'Resource', {
      authenticationOptions: renderAuthenticationOptions(props.clientCertificateArn, props.userBasedAuthentication),
      clientCidrBlock: props.cidr,
      clientConnectOptions: props.clientConnectionHandler
        ? {
          enabled: true,
          lambdaFunctionArn: props.clientConnectionHandler.functionArn,
        }
        : undefined,
      connectionLogOptions: {
        enabled: logging,
        cloudwatchLogGroup: logGroup?.logGroupName,
        cloudwatchLogStream: props.logStream?.logStreamName,
      },
      description: props.description,
      dnsServers: props.dnsServers,
      clientRouteEnforcementOptions: props.clientRouteEnforcementOptions,
      securityGroupIds: securityGroups.map(s => s.securityGroupId),
      selfServicePortal: booleanToEnabledDisabled(props.selfServicePortal),
      serverCertificateArn: props.serverCertificateArn,
      splitTunnel: props.splitTunnel,
      transportProtocol: props.transportProtocol,
      vpcId: props.vpc.vpcId,
      vpnPort: props.port,
      sessionTimeoutHours: props.sessionTimeout,
      clientLoginBannerOptions: props.clientLoginBanner
        ? {
          enabled: true,
          bannerText: props.clientLoginBanner,
        }
        : undefined,
    });

    this.endpointId = endpoint.ref;

    if (props.userBasedAuthentication && (props.selfServicePortal ?? true)) {
      // Output self-service portal URL
      new CfnOutput(this, 'SelfServicePortalUrl', {
        value: `https://self-service.clientvpn.amazonaws.com/endpoints/${this.endpointId}`,
      });
    }

    // Associate subnets
    const subnetIds = props.vpc.selectSubnets(props.vpcSubnets).subnetIds;

    if (Token.isUnresolved(subnetIds)) {
      throw new ValidationError('Cannot associate subnets when VPC are imported from parameters or exports containing lists of subnet IDs.', this);
    }

    for (const [idx, subnetId] of Object.entries(subnetIds)) {
      this._targetNetworksAssociated.add(new CfnClientVpnTargetNetworkAssociation(this, `Association${idx}`, {
        clientVpnEndpointId: this.endpointId,
        subnetId,
      }));
    }
    this.targetNetworksAssociated = this._targetNetworksAssociated;

    if (props.authorizeAllUsersToVpcCidr ?? true) {
      this.addAuthorizationRule('AuthorizeAll', {
        cidr: props.vpc.vpcCidrBlock,
      });
    }
  }

  public get clientVpnEndpointRef(): ClientVpnEndpointReference {
    return {
      clientVpnEndpointId: this.endpointId,
    };
  }

  /**
   * Adds an authorization rule to this endpoint
   */
  @MethodMetadata()
  public addAuthorizationRule(id: string, props: ClientVpnAuthorizationRuleOptions): ClientVpnAuthorizationRule {
    return new ClientVpnAuthorizationRule(this, id, {
      ...props,
      clientVpnEndpoint: this,
    });
  }

  /**
   * Adds a route to this endpoint
   */
  @MethodMetadata()
  public addRoute(id: string, props: ClientVpnRouteOptions): ClientVpnRoute {
    return new ClientVpnRoute(this, id, {
      ...props,
      clientVpnEndpoint: this,
    });
  }
}

function renderAuthenticationOptions(
  clientCertificateArn?: string,
  userBasedAuthentication?: ClientVpnUserBasedAuthentication): CfnClientVpnEndpoint.ClientAuthenticationRequestProperty[] {
  const authenticationOptions: CfnClientVpnEndpoint.ClientAuthenticationRequestProperty[] = [];

  if (clientCertificateArn) {
    authenticationOptions.push({
      type: 'certificate-authentication',
      mutualAuthentication: {
        clientRootCertificateChainArn: clientCertificateArn,
      },
    });
  }

  if (userBasedAuthentication) {
    authenticationOptions.push(userBasedAuthentication.render());
  }

  if (authenticationOptions.length === 0) {
    throw new UnscopedValidationError('A client VPN endpoint must use at least one authentication option');
  }
  return authenticationOptions;
}

function booleanToEnabledDisabled(val?: boolean): 'enabled' | 'disabled' | undefined {
  switch (val) {
    case undefined:
      return undefined;
    case true:
      return 'enabled';
    case false:
      return 'disabled';
  }
}

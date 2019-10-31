import { Construct, Duration, IResource, Resource } from '@aws-cdk/core';
import { BaseListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { Protocol, SslPolicy } from '../shared/enums';
import { INetworkLoadBalancer } from './network-load-balancer';
import { INetworkLoadBalancerTarget, INetworkTargetGroup, NetworkTargetGroup } from './network-target-group';

/**
 * Basic properties for a Network Listener
 */
export interface BaseNetworkListenerProps {
  /**
   * The port on which the listener listens for requests.
   */
  readonly port: number;

  /**
   * Default target groups to load balance to
   *
   * @default - None.
   */
  readonly defaultTargetGroups?: INetworkTargetGroup[];

  /**
   * Protocol for listener, expects TCP or TLS
   *
   * @default - TLS if certificates are provided. TCP otherwise.
   */
  readonly protocol?: Protocol;

  /**
   * Certificate list of ACM cert ARNs
   *
   * @default - No certificates.
   */
  readonly certificates?: INetworkListenerCertificateProps[];

  /**
   * SSL Policy
   *
   * @default - Current predefined security policy.
   */
  readonly sslPolicy?: SslPolicy;
}

/**
 * Properties for adding a certificate to a listener
 */
export interface INetworkListenerCertificateProps {
  /**
   * Certificate ARN from ACM
   */
  readonly certificateArn: string
}

/**
 * Properties for a Network Listener attached to a Load Balancer
 */
export interface NetworkListenerProps extends BaseNetworkListenerProps {
  /**
   * The load balancer to attach this listener to
   */
  readonly loadBalancer: INetworkLoadBalancer;
}

/**
 * Define a Network Listener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export class NetworkListener extends BaseListener implements INetworkListener {
  /**
   * Import an existing listener
   */
  public static fromNetworkListenerArn(scope: Construct, id: string, networkListenerArn: string): INetworkListener {
    class Import extends Resource implements INetworkListener {
      public listenerArn = networkListenerArn;
    }

    return new Import(scope, id);
  }

  /**
   * The load balancer this listener is attached to
   */
  private readonly loadBalancer: INetworkLoadBalancer;

  constructor(scope: Construct, id: string, props: NetworkListenerProps) {
    const certs = props.certificates || [];
    const proto = props.protocol || (certs.length > 0 ? Protocol.TLS : Protocol.TCP);

    if (NLB_PROTOCOLS.indexOf(proto) === -1) {
      throw new Error(`The protocol must be one of ${NLB_PROTOCOLS.join(', ')}. Found ${props.protocol}`);
    }

    if (proto === Protocol.TLS && certs.filter(v => v != null).length === 0) {
      throw new Error(`When the protocol is set to TLS, you must specify certificates`);
    }

    if (proto !== Protocol.TLS && certs.length > 0) {
      throw new Error(`Protocol must be TLS when certificates have been specified`);
    }

    super(scope, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      protocol: proto,
      port: props.port,
      sslPolicy: props.sslPolicy,
      certificates: props.certificates
    });

    this.loadBalancer = props.loadBalancer;

    (props.defaultTargetGroups || []).forEach(this._addDefaultTargetGroup.bind(this));
  }

  /**
   * Load balance incoming requests to the given target groups.
   */
  public addTargetGroups(_id: string, ...targetGroups: INetworkTargetGroup[]): void {
    // New default target(s)
    for (const targetGroup of targetGroups) {
      this._addDefaultTargetGroup(targetGroup);
      targetGroup.registerListener(this);
    }
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * @returns The newly created target group
   */
  public addTargets(id: string, props: AddNetworkTargetsProps): NetworkTargetGroup {
    if (!this.loadBalancer.vpc) {
      // tslint:disable-next-line:max-line-length
      throw new Error('Can only call addTargets() when using a constructed Load Balancer; construct a new TargetGroup and use addTargetGroup');
    }

    const group = new NetworkTargetGroup(this, id + 'Group', {
      deregistrationDelay: props.deregistrationDelay,
      healthCheck: props.healthCheck,
      port: props.port,
      proxyProtocolV2: props.proxyProtocolV2,
      targetGroupName: props.targetGroupName,
      targets: props.targets,
      vpc: this.loadBalancer.vpc,
    });

    this.addTargetGroups(id, group);

    return group;
  }
}

/**
 * Properties to reference an existing listener
 */
export interface INetworkListener extends IResource {
  /**
   * ARN of the listener
   * @attribute
   */
  readonly listenerArn: string;
}

/**
 * Properties for adding new network targets to a listener
 */
export interface AddNetworkTargetsProps {
  /**
   * The port on which the listener listens for requests.
   *
   * @default Determined from protocol if known
   */
  readonly port: number;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. If you use either `Instance` or `IPAddress` as targets, all
   * target must be of the same type.
   */
  readonly targets?: INetworkLoadBalancerTarget[];

  /**
   * The name of the target group.
   *
   * This name must be unique per region per account, can have a maximum of
   * 32 characters, must contain only alphanumeric characters or hyphens, and
   * must not begin or end with a hyphen.
   *
   * @default Automatically generated
   */
  readonly targetGroupName?: string;

  /**
   * The amount of time for Elastic Load Balancing to wait before deregistering a target.
   *
   * The range is 0-3600 seconds.
   *
   * @default Duration.minutes(5)
   */
  readonly deregistrationDelay?: Duration;

  /**
   * Indicates whether Proxy Protocol version 2 is enabled.
   *
   * @default false
   */
  readonly proxyProtocolV2?: boolean;

  /**
   * Health check configuration
   *
   * @default No health check
   */
  readonly healthCheck?: HealthCheck;
}

const NLB_PROTOCOLS = [Protocol.TCP, Protocol.TLS, Protocol.UDP, Protocol.TCP_UDP];

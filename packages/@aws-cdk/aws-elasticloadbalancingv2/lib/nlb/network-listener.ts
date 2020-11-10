import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseListener, BaseListenerLookupOptions } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { Protocol, SslPolicy } from '../shared/enums';
import { IListenerCertificate } from '../shared/listener-certificate';
import { validateNetworkProtocol } from '../shared/util';
import { NetworkListenerAction } from './network-listener-action';
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
   * All target groups will be load balanced to with equal weight and without
   * stickiness. For a more complex configuration than that, use
   * either `defaultAction` or `addAction()`.
   *
   * Cannot be specified together with `defaultAction`.
   *
   * @default - None.
   */
  readonly defaultTargetGroups?: INetworkTargetGroup[];

  /**
   * Default action to take for requests to this listener
   *
   * This allows full control of the default Action of the load balancer,
   * including weighted forwarding. See the `NetworkListenerAction` class for
   * all options.
   *
   * Cannot be specified together with `defaultTargetGroups`.
   *
   * @default - None.
   */
  readonly defaultAction?: NetworkListenerAction;

  /**
   * Protocol for listener, expects TCP, TLS, UDP, or TCP_UDP.
   *
   * @default - TLS if certificates are provided. TCP otherwise.
   */
  readonly protocol?: Protocol;

  /**
   * Certificate list of ACM cert ARNs
   *
   * @default - No certificates.
   */
  readonly certificates?: IListenerCertificate[];

  /**
   * SSL Policy
   *
   * @default - Current predefined security policy.
   */
  readonly sslPolicy?: SslPolicy;
}

/**
 * Properties for adding a certificate to a listener
 *
 * This interface exists for backwards compatibility.
 *
 * @deprecated Use IListenerCertificate instead
 */
export interface INetworkListenerCertificateProps extends IListenerCertificate {
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
 * Options for looking up a network listener.
 */
export interface NetworkListenerLookupOptions extends BaseListenerLookupOptions {
  /**
   * Protocol of the listener port
   * @default - listener is not filtered by protocol
   */
  readonly listenerProtocol?: Protocol;
}

/**
 * Define a Network Listener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export class NetworkListener extends BaseListener implements INetworkListener {
  /**
   * Looks up a network listener
   */
  public static fromLookup(scope: Construct, id: string, options: NetworkListenerLookupOptions): INetworkListener {
    let listenerProtocol: cxschema.LoadBalancerListenerProtocol | undefined;
    if (options.listenerProtocol) {
      validateNetworkProtocol(options.listenerProtocol);

      switch (options.listenerProtocol) {
        case Protocol.TCP: listenerProtocol = cxschema.LoadBalancerListenerProtocol.TCP; break;
        case Protocol.UDP: listenerProtocol = cxschema.LoadBalancerListenerProtocol.UDP; break;
        case Protocol.TCP_UDP: listenerProtocol = cxschema.LoadBalancerListenerProtocol.TCP_UDP; break;
        case Protocol.TLS: listenerProtocol = cxschema.LoadBalancerListenerProtocol.TLS; break;
      }
    }

    const props = BaseListener._queryContextProvider(scope, {
      userOptions: options,
      listenerProtocol: listenerProtocol,
      loadBalancerType: cxschema.LoadBalancerType.NETWORK,
    });

    class LookedUp extends Resource implements INetworkListener {
      public listenerArn = props.listenerArn;
    }

    return new LookedUp(scope, id);
  }

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
  public readonly loadBalancer: INetworkLoadBalancer;

  /**
   * the protocol of the listener
   */
  private readonly protocol: Protocol;

  constructor(scope: Construct, id: string, props: NetworkListenerProps) {
    const certs = props.certificates || [];
    const proto = props.protocol || (certs.length > 0 ? Protocol.TLS : Protocol.TCP);

    validateNetworkProtocol(proto);

    if (proto === Protocol.TLS && certs.filter(v => v != null).length === 0) {
      throw new Error('When the protocol is set to TLS, you must specify certificates');
    }

    if (proto !== Protocol.TLS && certs.length > 0) {
      throw new Error('Protocol must be TLS when certificates have been specified');
    }

    super(scope, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      protocol: proto,
      port: props.port,
      sslPolicy: props.sslPolicy,
      certificates: props.certificates,
    });

    this.loadBalancer = props.loadBalancer;
    this.protocol = proto;

    if (props.defaultAction && props.defaultTargetGroups) {
      throw new Error('Specify at most one of \'defaultAction\' and \'defaultTargetGroups\'');
    }

    if (props.defaultAction) {
      this.setDefaultAction(props.defaultAction);
    }

    if (props.defaultTargetGroups) {
      this.setDefaultAction(NetworkListenerAction.forward(props.defaultTargetGroups));
    }
  }

  /**
   * Load balance incoming requests to the given target groups.
   *
   * All target groups will be load balanced to with equal weight and without
   * stickiness. For a more complex configuration than that, use `addAction()`.
   */
  public addTargetGroups(_id: string, ...targetGroups: INetworkTargetGroup[]): void {
    this.setDefaultAction(NetworkListenerAction.forward(targetGroups));
  }

  /**
   * Perform the given Action on incoming requests
   *
   * This allows full control of the default Action of the load balancer,
   * including weighted forwarding. See the `NetworkListenerAction` class for
   * all options.
   */
  public addAction(_id: string, props: AddNetworkActionProps): void {
    this.setDefaultAction(props.action);
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates a NetworkTargetGroup for the targets
   * involved, and a 'forward' action to route traffic to the given TargetGroup.
   *
   * If you want more control over the precise setup, create the TargetGroup
   * and use `addAction` yourself.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  public addTargets(id: string, props: AddNetworkTargetsProps): NetworkTargetGroup {
    if (!this.loadBalancer.vpc) {
      // eslint-disable-next-line max-len
      throw new Error('Can only call addTargets() when using a constructed Load Balancer or imported Load Balancer with specified VPC; construct a new TargetGroup and use addTargetGroup');
    }

    const group = new NetworkTargetGroup(this, id + 'Group', {
      deregistrationDelay: props.deregistrationDelay,
      healthCheck: props.healthCheck,
      port: props.port,
      protocol: props.protocol ?? this.protocol,
      proxyProtocolV2: props.proxyProtocolV2,
      targetGroupName: props.targetGroupName,
      targets: props.targets,
      vpc: this.loadBalancer.vpc,
    });

    this.addTargetGroups(id, group);

    return group;
  }

  /**
   * Wrapper for _setDefaultAction which does a type-safe bind
   */
  private setDefaultAction(action: NetworkListenerAction) {
    action.bind(this, this);
    this._setDefaultAction(action);
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
 * Properties for adding a new action to a listener
 */
export interface AddNetworkActionProps {
  /**
   * Action to perform
   */
  readonly action: NetworkListenerAction;
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
   * Protocol for target group, expects TCP, TLS, UDP, or TCP_UDP.
   *
   * @default - inherits the protocol of the listener
   */
  readonly protocol?: Protocol;

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
